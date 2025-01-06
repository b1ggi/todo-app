from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from pathlib import Path

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Model für To-Do-Aufgaben
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    complete = db.Column(db.Boolean, default=False)

# Startseite anzeigen
@app.route('/')
def index():
    tasks = db.session.query(Task).filter_by(complete=False).all()
    completed = db.session.query(Task).filter_by(complete=True).all()
    return render_template('index.html', tasks=tasks, completed=completed)

# Aufgabe hinzufügen
@app.route('/add', methods=['POST'])
def add_task():
    title = request.form.get('title')
    if title:
        new_task = Task(title=title)
        db.session.add(new_task)
        db.session.commit()
    return jsonify({"message": "Task added!"}), 200

# Aufgabe löschen
@app.route('/delete/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted!"}), 200

# Aufgabe ändern
@app.route('/update/<int:task_id>', methods=['POST'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)

    new_complete = request.form.get('complete')
    new_title = request.form.get('title')
    
    if new_complete == "True":
        task.complete=True
        db.session.commit()
        return jsonify({"message": "Task completed!"}), 200
    elif new_complete == "False":
        print("Task restored")
        task.complete=False
        db.session.commit()
        return jsonify({"message": "Task restored!"}), 200
    elif new_title:
        task.title = new_title
        db.session.commit()
        return jsonify({"message": "Title updated!"}), 200
    else:
        return jsonify({"message": "No update provided!"}), 400

if __name__ == '__main__':
    dbfile=Path("./todo.db")
    if not dbfile.exists():
        with app.app_context():
            db.create_all() 
    app.run(debug=True)
