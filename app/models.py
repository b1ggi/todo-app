from app import db

class Project(db.Model):
    __tablename__ = 'project'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    archived = db.Column(db.Boolean, default=False)
    is_default = db.Column(db.Boolean, default=False)
    lists = db.relationship('List', backref='project', lazy=True, order_by="List.position")
    
# Klassen
class List(db.Model):
    __tablename__ = 'list'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    archived = db.Column(db.Boolean, default=False)
    position = db.Column(db.Integer, nullable=False, default=0)
    collapsed = db.Column(db.Boolean, default=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    tasks = db.relationship('Task', backref='list', lazy=True)

    @classmethod
    def get_next_position(cls, project_id):
        highest_position = cls.query.filter_by(project_id=project_id, archived=False).order_by(cls.position.desc()).first()
        if highest_position is not None and highest_position.position >= 0:
            return highest_position.position + 1
        else:
            return 0
    
    @classmethod
    def order_active(cls, project_id):
        project_lists = cls.query.filter_by(project_id=project_id, archived=False).order_by(cls.position.asc()).all()
        for idx, lst in enumerate(project_lists):
            lst.position = idx
        if project_lists == []:
            return None
        else:
            return len(project_lists)

class Task(db.Model):
    __tablename__ = 'task'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    body = db.Column(db.Text, nullable=True)
    archived = db.Column(db.Boolean, default=False)
    onhold = db.Column(db.Boolean, default=False)
    # 0 = normal, 1 = high, 2 = low
    prio = db.Column(db.Integer, default=0)
    list_id = db.Column(db.Integer, db.ForeignKey('list.id'), nullable=False)
    # parent task
    parent_id = db.Column(db.Integer, db.ForeignKey('task.id'))
    parent   = db.relationship('Task', back_populates='subtasks', remote_side=[id])
    subtasks = db.relationship('Task', back_populates='parent', lazy='select')