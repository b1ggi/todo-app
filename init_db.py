from app import app, db
with app.app_context():
    db.create_all()

    #Check if the default project exists
    default_project = app.Project.query.filter_by(is_default=True).first()
    if not default_project:
        #Create the default project
        default_project = app.Project(title="Default Project", is_default=True)
        db.session.add(default_project)
        db.session.commit()
    
    
    #Check if the default list exists
    default_list = app.List.query.filter_by(is_default=True).first()
    if not default_list:
        #Create the default list
        default_list = app.List(title="Default List", project_id=default_project.id, is_default=True)
        db.session.add(default_list)
        db.session.flush()

        #für die Entwicklung: füge card zu, TODO: später entfernen
        dev_card = app.Task(title="Entwickler-Task", body="Erstelle die App mit Flask und SQLAlchemy", list_id=default_list.id)
        db.session.add(dev_card)
        db.session.flush()
        #für die Entwicklung: füge subcardcard zu, TODO: später entfernen
        dev_subcard = app.Subtask(title="Entwickler-Subtask", task_id=dev_card.id)
        db.session.add(dev_subcard)     

        db.session.commit()