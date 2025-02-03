from app import app, db
with app.app_context():
    db.create_all()

    #Check if the default project exists
    default_project = Project.query.filter_by(is_default=True).first()
    if not default_project:
        #Create the default project
        default_project = Project(name="Default Project", is_default=True)
        db.session.add(default_project)
        db.session.commit()
    
    
    #Check if the default list exists
    default_list = List.query.filter_by(is_default=True).first()
    if not default_list:
        #Create the default list
        default_list = List(name="Default List", project_id=default_project.id, is_default=True)
        db.session.add(default_list)
        db.session.commit()