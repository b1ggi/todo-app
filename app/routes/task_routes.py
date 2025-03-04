from flask import Blueprint, request, jsonify, Response
from app import db
from app.models import Task
from app.helpers import get_or_404

task_bp = Blueprint('task_bp', __name__)

#Aufgabe hinzufügen
@task_bp.route('/', methods=['POST'])
def add_task() -> Response:
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
@task_bp.route('/<int:task_id>', methods=['PUT'])
def update_task(task_id) -> Response:
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