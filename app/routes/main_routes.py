from flask import Blueprint, render_template
from app.models import Project, List, Card
from app import db

main_bp = Blueprint('main_bp', __name__)

@main_bp.route('/')
def index() -> str:
    #Default Project
    project = db.session.query(Project).filter_by(is_default=True).first()
    #Liste
    lists = db.session.query(List).filter_by(archived=False, project_id=project.id).order_by(List.position.asc()).all()

    #Dict
    cards_by_list = {}

    for single_list in lists:
        #Liste
        list_cards = db.session.query(Card).filter_by(archived=False, list_id=single_list.id).all()
        cards_by_list[single_list.id] = list_cards

    return render_template('index.html',project=project, lists=lists, cards_by_list=cards_by_list)