
# To-Do List Application

A simple to-do list web application built with **Flask** and **SQLAlchemy**.
It allows users to **add**, **delete**, and **update** tasks.

![image](https://github.com/user-attachments/assets/68f1436d-77fe-4d24-a6b5-426aa41625b3)





## 🛠️ Requirements

The application requires the following Python packages:

- **blinker==1.9.0**  
- **click==8.1.8**  
- **colorama==0.4.6**  
- **Flask==3.1.0**  
- **Flask-SQLAlchemy==3.1.1**  
- **itsdangerous==2.2.0**  
- **Jinja2==3.1.5**  
- **MarkupSafe==3.0.2**  
- **repoze.lru==0.7**  
- **six==1.17.0**  
- **SQLAlchemy==2.0.36**  
- **typing_extensions==4.12.2**  
- **Werkzeug==3.1.3**

Install them via:

```bash
pip install -r requirements.txt
```

---

## ▶️ Running the Application

Run the application with:

```bash
python app.py
```

Open your browser at [http://127.0.0.1:5000/](http://127.0.0.1:5000/) to access the app.

---

## ✨ Application Features

### 1. Add a Task
- **Action**: Enter the task title in the input field and click **Hinzufügen**.  
- **Result**: The new task appears in the list.

### 2. Delete a Task
- **Action**: Click **Löschen** next to the task.  
- **Result**: The task is removed from the list.

### 3. Complete a Task
- **Action**: Click **Erledigen** next to a task.  
- **Result**: The task moves to the completed tasks section.

### 4. Restore a Task
- **Action**: Click **Wiederherstellen** next to a completed task.  
- **Result**: The task returns to the active tasks section.

---

## 📄 File Descriptions

- **app.py**  
  The main Flask application file, containing routes, the database model, and app initialization.  
- **requirements.txt**  
  Lists all the required Python packages for this project.  
- **app.js**  
  JavaScript file handling add, delete, complete, and restore task actions.  
- **style.css**  
  CSS file defining the application’s styling.  
- **index.html**  
  The main HTML template for rendering the to-do list interface.  
- **.gitignore**  
  Specifies files and directories that Git should ignore (e.g., `__pycache__`, `.venv`, etc.).

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
