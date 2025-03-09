from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

from app.helpers import init_db


def create_app():
    app = Flask(__name__, template_folder='../templates', static_folder='../static')
    app.config.from_object('config.Config')  # aus separater Konfig-Datei
    db.init_app(app)
    migrate.init_app(app, db)
    # Alle Models importieren für Migration
    from app import models

    with app.app_context():
        init_db()  # Initialisierung der Datenbank

    # Blueprints importieren und registrieren
    from app.routes.main_routes import main_bp
    from app.routes.list_routes import list_bp
    from app.routes.card_routes import card_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(list_bp, url_prefix='/list')
    app.register_blueprint(card_bp, url_prefix='/card')

    return app