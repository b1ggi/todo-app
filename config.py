import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
instance_path = os.path.join(BASE_DIR, 'instance', 'todo.db')

class Config:
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{instance_path}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False