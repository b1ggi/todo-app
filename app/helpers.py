from __future__ import annotations
from flask import abort, current_app
from app import db
from app.models import Project, List, Task





# Hilfsfunktionen
def get_or_404(model, object_id: int):
    """
    Retrieve an object by its ID or abort with a 404 error if not found.
    """
    obj = db.session.query(model).get(object_id)
    if obj is None:
        abort(404)
    return obj

def init_db() -> str:    
    """
    Initialize the database with default project and list.
    This function performs the following tasks:
    1. Creates all database tables.
    2. Checks if the default project exists; if not, creates it.
    3. Checks if the default list exists within the default project; if not, creates it.
    4. For development purposes, adds a default task and a subtask to the default list.
    Note: The development tasks added are temporary and should be removed later.
    Returns:
        str: Success message if everything is ok.
    """
    with current_app.app_context():
        db.create_all()

        # Check if the default project exists
        default_project = Project.query.filter_by(is_default=True).first()
        if not default_project:
            # Create the default project
            default_project = Project(title="Default Project", is_default=True)
            db.session.add(default_project)
            db.session.commit()
        
        # Check if the default list exists
        default_list = List.query.filter_by(project_id=default_project.id, position=0).first()
        if not default_list:
            # Create the default list
            default_list = List(title="Default List", project_id=default_project.id)
            db.session.add(default_list)
            db.session.flush()

            # For development: add a task, TODO: remove later
            dev_card = Task(title="Entwickler-Task", body="Erstelle die App mit Flask und SQLAlchemy", list_id=default_list.id)
            db.session.add(dev_card)
            db.session.flush()
            # For development: add a subtask, TODO: remove later
            dev_subcard = Task(title="Entwickler-Subtask", list_id=default_list.id, parent_id=dev_card.id)
            db.session.add(dev_subcard)     
            db.session.commit()
    
    return "Database initialized successfully"