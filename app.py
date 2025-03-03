from flask import Flask, render_template, request, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
#import logging


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Hilfsfunktionen
def get_or_404(model, object_id):
    result = db.session.get(model, object_id)
    if result is None:
        abort(404)
    return result

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    archived = db.Column(db.Boolean, default=False)
    is_default = db.Column(db.Boolean, default=False)
    lists = db.relationship('List', backref='project', lazy=True, order_by="List.position")
    
# Klassen
class List(db.Model):
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
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    body = db.Column(db.Text, nullable=True)
    archived = db.Column(db.Boolean, default=False)
    onhold = db.Column(db.Boolean, default=False)
    # 0 = normal, 1 = high, 2 = low
    prio = db.Column(db.Integer, default=0)
    list_id = db.Column(db.Integer, db.ForeignKey('list.id'), nullable=False)
    subtasks = db.relationship('Subtask', backref='task', lazy=True)

class Subtask(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    body = db.Column(db.Text, nullable=True)
    archived = db.Column(db.Boolean, default=False)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    
    

#Datenbankinitialisierungsfunktion
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
        default_list = List.query.filter_by(project_id=default_project.id, position=0).first()
        if not default_list:
            #Create the default list
            default_list = List(title="Default List", project_id=default_project.id)
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
    #Default Project
    project = db.session.query(Project).filter_by(is_default=True).first()
    #Liste
    lists = db.session.query(List).filter_by(archived=False, project_id=project.id).order_by(List.position.asc()).all()

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
        project = db.session.get(Project, project_id)
        if project:
            new_list = List(
                title=title,
                project_id=project_id,
                position=0
                )
            #Position der Liste festlegen 1 höher als die letzte Position
            new_list.position = List.get_next_position(project_id)            
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

    #Liste-Objekt
    list = get_or_404(List, list_id)

    #Tasks der Liste
    tasks = Task.query.filter_by(list_id=list_id).all()

    # Request-Parameter
    new_archived = request.form.get('archived')
    new_title = request.form.get('title')
    new_project_id = request.form.get('project_id')
    before_position = request.form.get('before_position')
    new_position = request.form.get('position')
    new_collapsed = request.form.get('collapsed')
    
    if new_archived == "True":
        list.archived=True

        #Position der Liste auf -1 setzen
        list.position = -1
        # Tasks mit archivieren
        for task in tasks:
            task.archived=True
            # Subtasks mit archivieren
            for subtask in Subtask.query.filter_by(task_id=task.id).all():
                subtask.archived=True
        
        #Projekt archivieren wenn alle Listen archiviert sind
        if List.get_next_position(list.project_id) == 0:
            db.session.get(Project, list.project_id).archived=True
        else:
            #Positionen aktualisieren
            List.order_active(list.project_id)

        db.session.commit()
        return jsonify({"message": "List and Tasks archived!"}), 200
    elif new_archived == "False":

        #Liste wiederherstellen
        list.archived=False

        #Position der Liste festlegen 1 höher als die letzte Position
        list.position = List.get_next_position(list.project_id)

        #Projekt wiederherstellen
        db.session.get(Project, list.project_id).archived=False

        #Tasks wiederherstellen
        for task in tasks:
            task.archived=False
            # Subtasks wiederherstellen
            for subtask in Subtask.query.filter_by(task_id=task.id).all():
                subtask.archived=False
                
        db.session.commit()
        return jsonify({"message": "List and Tasks restored!"}), 200
    
    elif new_title:
        #Titel ändern
        list.title = new_title

        db.session.commit()
        return jsonify({"message": "Title updated!"}), 200
    elif new_project_id:
        #Projekt ändern
        project = db.session.get(Project, new_project_id)

        if project:
            list.project_id = new_project_id
            #Position der Liste festlegen 1 höher als die letzte Position im neuen Projekt
            list.position = List.get_next_position(new_project_id)

            db.session.commit()
            return jsonify({"message": "Project updated!"}), 200
        else:
            return jsonify({"message": "Project not found!"}), 404
    elif new_position and before_position:
        #Position ändern
        #Positionen in Integer umwandeln
        new_position = int(new_position)
        before_position = int(before_position)

        #Positionen überprüfen
        if new_position >= 0 and before_position >= 0:
            #Liste aller Listen des Projekts sortiert nach Position
            project_lists = List.query.filter_by(project_id=list.project_id, archived=False).order_by(List.position.asc()).all()

            #Liste an neuer Position einfügen
            moved_list = project_lists.pop(before_position)
            project_lists.insert(new_position, moved_list)
            
            #Positionen aktualisieren
            List.order_active(list.project_id)

            db.session.commit()

            return jsonify({"message": "Position updated!"}), 200

        else:
            return jsonify({"message": "Position must be greater or equal to 0!"}), 400
    elif new_collapsed:
        #Collapsed-Status ändern
        if new_collapsed == "True":
            list.collapsed=True
            db.session.commit()
            return jsonify({"message": "List collapsed!"}), 200
        elif new_collapsed == "False":
            list.collapsed=False
            db.session.commit()
            return jsonify({"message": "List expanded!"}), 200
    else:
        return jsonify({"message": "No update provided!"}), 400
    
#Liste löschen
@app.route('/list/<int:list_id>', methods=['DELETE'])
def delete_list(list_id):
    list = get_or_404(List, list_id)
    project = db.session.get(Project, list.project_id)
    db.session.delete(list)
    #Positionen aktualisieren
    if project:
        List.order_active(project.id)

    db.session.commit()
    return jsonify({"message": "List deleted!"}), 200


#Aufgabe hinzufügen
@app.route('/card', methods=['POST'])
def add_task():
    title = request.form.get('title')
    list_id = request.form.get('list_id')
    body = request.form.get('body')
    if title and list_id:
        new_task = Task(
            title=title,
            list_id=list_id,
            body=body
            )
        db.session.add(new_task)
        db.session.commit()
        return jsonify({"message": "Task added!"}), 200
    else:
        return jsonify({"message": "Title and list_id are required!"}), 400


#Aufgabe ändern
@app.route('/card/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = get_or_404(Task, task_id)

    action = request.form.get('action')
    
    if action == "archive":
        task.archived = not task.archived
        db.session.commit()
        return jsonify({"message": "Task toggle archived!"}), 200
    elif action == "onhold":
        task.onhold = not task.onhold
        db.session.commit()
        return jsonify({"message": "Task toggle on hold!"}), 200
    elif action == "prio_high":
        task.prio = 1
        db.session.commit()
        return jsonify({"message": "High Priority set!"}), 200
    elif action == "prio_normal":
        task.prio = 0
        db.session.commit()
        return jsonify({"message": "Normal Priority set!"}), 200
    elif action == "prio_low":
        task.prio = 2
        db.session.commit()
        return jsonify({"message": "Low Priority set!"}), 200
    elif action == None:
        new_title = request.form.get('title')
        new_body = request.form.get('body')
        if new_title or new_body:
            task.title = new_title
            if new_body == '':
                task.body = None
            else:
                task.body = new_body
            db.session.commit()
            return jsonify({"message": "Title and Body updated!"}), 200
        else:
            return jsonify({"message": "No update provided!"}), 400
    else:
        return jsonify({"message": "No update provided!"}), 400







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
