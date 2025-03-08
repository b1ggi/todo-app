from flask import Blueprint, request, jsonify, Response
from app import db
from app.models import List, Project, Card
from app.helpers import get_or_404

list_bp = Blueprint('list_bp', __name__)

#Liste hinzufügen
@list_bp.route('/', methods=['POST'])
def add_list() -> Response:
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
@list_bp.route('/<int:list_id>', methods=['POST'])
def update_list(list_id) -> Response:

    #Liste-Objekt
    list = get_or_404(List, list_id)

    #Cards der Liste
    cards = Card.query.filter_by(list_id=list_id).all()

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
        # cards mit archivieren
        for card in cards:
            card.archived=True
        
        #Projekt archivieren wenn alle Listen archiviert sind
        if List.get_next_position(list.project_id) == 0:
            db.session.get(Project, list.project_id).archived=True
        else:
            #Positionen aktualisieren
            List.order_active(list.project_id)

        db.session.commit()
        return jsonify({"message": "List and cards archived!"}), 200
    elif new_archived == "False":

        #Liste wiederherstellen
        list.archived=False

        #Position der Liste festlegen 1 höher als die letzte Position
        list.position = List.get_next_position(list.project_id)

        #Projekt wiederherstellen
        db.session.get(Project, list.project_id).archived=False

        #cards wiederherstellen
        for card in cards:
            card.archived=False
                
        db.session.commit()
        return jsonify({"message": "List and cards restored!"}), 200
    
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
            #Position der Liste festlegen auf 1 höher als die letzte Position im neuen Projekt
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
@list_bp.route('/<int:list_id>', methods=['DELETE'])
def delete_list(list_id) -> Response:
    list = get_or_404(List, list_id)
    project = db.session.get(Project, list.project_id)
    db.session.delete(list)
    #Positionen aktualisieren
    if project:
        List.order_active(project.id)

    db.session.commit()
    return jsonify({"message": "List deleted!"}), 200