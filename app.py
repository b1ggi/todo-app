from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    archived = db.Column(db.Boolean, default=False)
    is_default = db.Column(db.Boolean, default=False)
    lists = db.relationship('List', backref='project', lazy=True)
    

class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    archived = db.Column(db.Boolean, default=False)
    is_default = db.Column(db.Boolean, default=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    tasks = db.relationship('Task', backref='list', lazy=True)

# Model für To-Do-Aufgaben
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    body = db.Column(db.Text, nullable=True)
    archived = db.Column(db.Boolean, default=False)
    list_id = db.Column(db.Integer, db.ForeignKey('list.id'), nullable=False)
    subtasks = db.relationship('Subtask', backref='task', lazy=True)

class Subtask(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    archived = db.Column(db.Boolean, default=False)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    
    


def init_db():    
    with app.app_context():
        db.create_all()

        #Check if the default project exists
        default_project = Project.query.filter_by(is_default=True).first()
        if not default_project:
            #Create the default project
            default_project = Project(title="Default Project", is_default=True)
            db.session.add(default_project)
            db.session.commit()
        
        
        #Check if the default list exists
        default_list = List.query.filter_by(is_default=True).first()
        if not default_list:
            #Create the default list
            default_list = List(title="Default List", project_id=default_project.id, is_default=True)
            db.session.add(default_list)
            db.session.flush()

            #für die Entwicklung: füge card zu, TODO: später entfernen
            dev_card = Task(title="Entwickler-Task", body="Erstelle die App mit Flask und SQLAlchemy", list_id=default_list.id)
            db.session.add(dev_card)
            db.session.flush()
            #für die Entwicklung: füge subcardcard zu, TODO: später entfernen
            dev_subcard = Subtask(title="Entwickler-Subtask", task_id=dev_card.id)
            db.session.add(dev_subcard)     

            db.session.commit()

#Datenbank initialisieren
init_db()


# Startseite anzeigen
@app.route('/')
def index():
    #Int?
    project = db.session.query(Project).filter_by(is_default=True).first()
    #Liste
    lists = db.session.query(List).filter_by(archived=False, project_id=project.id).all()

    #Dict
    tasks_by_list = {}
    subtasks_by_task = {}

    for single_list in lists:
        #Liste
        list_tasks = db.session.query(Task).filter_by(archived=False, list_id=single_list.id).all()

        tasks_by_list[single_list.id] = list_tasks

        for single_task in list_tasks:
            #Liste
            task_subtasks = db.session.query(Subtask).filter_by(archived=False, task_id=single_task.id).all()

            subtasks_by_task[single_task.id] = task_subtasks

    return render_template('index.html',project=project, lists=lists, tasks_by_list=tasks_by_list, subtasks_by_task=subtasks_by_task)


#Liste hinzufügen
@app.route('/list', methods=['POST'])
def add_list():
    title = request.form.get('title')
    project_id = request.form.get('project_id')
    if title and project_id:
        project = Project.query.get(project_id)
        if project:
            new_list = List(title=title, project_id=project_id)
            db.session.add(new_list)
            db.session.commit()
            return jsonify({"message": "List added!"}), 200
        else:
            return jsonify({"message": "Project not found!"}), 404
    else:
        return jsonify({"message": "Title and project_id are required!"}), 400
    

#Liste ändern
@app.route('/list/<int:list_id>', methods=['POST'])
def update_list(list_id):
    list = List.query.get_or_404(list_id)
    tasks = Task.query.filter_by(list_id=list_id).all()

    new_archived = request.form.get('archived')
    new_title = request.form.get('title')
    new_project_id = request.form.get('project_id')
    
    if new_archived == "True":
        list.archived=True
        for task in tasks:
            task.archived=True
        db.session.commit()
        return jsonify({"message": "List and Tasks archived!"}), 200
    elif new_archived == "False":
        list.archived=False
        for task in tasks:
            task.archived=False
        db.session.commit()
        return jsonify({"message": "List and Tasks restored!"}), 200
    elif new_title:
        list.title = new_title
        db.session.commit()
        return jsonify({"message": "Title updated!"}), 200
    elif new_project_id:
        project = Project.query.get(new_project_id)
        if project:
            list.project_id = new_project_id
            db.session.commit()
            return jsonify({"message": "Project updated!"}), 200
        else:
            return jsonify({"message": "Project not found!"}), 404
    else:
        return jsonify({"message": "No update provided!"}), 400
    
#Liste löschen
@app.route('/list/<int:list_id>', methods=['DELETE'])
def delete_list(list_id):
    list = List.query.get_or_404(list_id)
    db.session.delete(list)
    db.session.commit()
    return jsonify({"message": "List deleted!"}), 200









# Aufgabe hinzufügen
# @app.route('/add', methods=['POST'])
# def add_task():
#     title = request.form.get('title')
#     body = request.form.get('body')
#     if title:
#         new_task = Task(title=title, body=body)
#         db.session.add(new_task)
#         db.session.commit()
#     return jsonify({"message": "Task added!"}), 200

# Aufgabe löschen
# @app.route('/delete/<int:task_id>', methods=['DELETE'])
# def delete_task(task_id):
#     task = Task.query.get_or_404(task_id)
#     db.session.delete(task)
#     db.session.commit()
#     return jsonify({"message": "Task deleted!"}), 200

# Aufgabe ändern
# @app.route('/update/<int:task_id>', methods=['POST'])
# def update_task(task_id):
#     task = Task.query.get_or_404(task_id)

#     new_archived = request.form.get('archived')
#     new_title = request.form.get('title')
#     new_body = request.form.get('body')
    
#     if new_archived == "True":
#         task.archived=True
#         db.session.commit()
#         return jsonify({"message": "Task archived!"}), 200
#     elif new_archived == "False":
#         task.archived=False
#         db.session.commit()
#         return jsonify({"message": "Task restored!"}), 200
#     elif new_title:
#         task.title = new_title
#         db.session.commit()
#         return jsonify({"message": "Title updated!"}), 200
#     elif new_body:
#         task.body = new_body
#         db.session.commit()
#         return jsonify({"message": "Body updated!"}), 200
#     else:
#         return jsonify({"message": "No update provided!"}), 400






if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
