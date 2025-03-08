from flask import Blueprint, request, jsonify, Response
from app import db
from app.models import Card
from app.helpers import get_or_404

card_bp = Blueprint('card_bp', __name__)

#Karte hinzufügen
@card_bp.route('/', methods=['POST'])
def add_card() -> Response:
    title = request.form.get('title')
    list_id = request.form.get('list_id')
    card_id = request.form.get('card_id')
    body = request.form.get('body')
    if title and list_id:
        new_card = Card(
            title=title,
            list_id=list_id,
            body=body
        )
        #Wenn card_id vorhanden, dann wird die Karte als Unterkarte hinzugefügt
        if card_id:
            new_card.parent_id = card_id
        db.session.add(new_card)
        db.session.commit()
        return jsonify({"message": "Card added!"}), 200
    else:
        return jsonify({"message": "Title and list_id are required!"}), 400


#Aufgabe ändern
@card_bp.route('/<int:card_id>', methods=['PUT'])
def update_card(card_id) -> Response:
    card = get_or_404(Card, card_id)

    action = request.form.get('action')
    
    if action == "archive":
        card.archived = not card.archived
        db.session.commit()
        return jsonify({"message": "Card toggle archived!"}), 200
    elif action == "onhold":
        card.onhold = not card.onhold
        db.session.commit()
        return jsonify({"message": "Card toggle on hold!"}), 200
    elif action == "prio_high":
        card.prio = 1
        db.session.commit()
        return jsonify({"message": "High Priority set!"}), 200
    elif action == "prio_normal":
        card.prio = 0
        db.session.commit()
        return jsonify({"message": "Normal Priority set!"}), 200
    elif action == "prio_low":
        card.prio = 2
        db.session.commit()
        return jsonify({"message": "Low Priority set!"}), 200
    elif action == "done":
        card.done = not card.done
        db.session.commit()
        return jsonify({"message": "Card toggle done!"}), 200
    elif action == None:
        new_title = request.form.get('title')
        new_body = request.form.get('body')
        if new_title or new_body:
            card.title = new_title
            if new_body == '':
                card.body = None
            else:
                card.body = new_body
            db.session.commit()
            return jsonify({"message": "Title and Body updated!"}), 200
        else:
            return jsonify({"message": "No update provided!"}), 400
    else:
        return jsonify({"message": "No update provided!"}), 400