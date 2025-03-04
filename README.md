# To-Do Application

A simple to-do list web application built with **Flask** and **SQLAlchemy**.

<img align="center" alt="Screenshot" src="https://github.com/user-attachments/assets/fcdd34e3-6fc1-4b54-ad88-80d3e0eed758">

## 🛠️ Requirements

The application requires the following Python packages:

- **blinker==1.9.0**
- **click==8.1.8**
- **colorama==0.4.6**
- **Flask==3.1.0**
- **Flask-SQLAlchemy==3.1.1**
- **gunicorn==20.1.0**
- **itsdangerous==2.2.0**
- **Jinja2==3.1.5**
- **MarkupSafe==3.0.2**
- **repoze.lru==0.7**
- **setuptools==75.7.0**
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

### Development Run

```bash
python run.py
```

Open your browser at [http://127.0.0.1:5000/](http://127.0.0.1:5000/) to access the app.

### Docker Run

Use Docker Compose File

or

```bash
docker run -d --name todo-app -v data:/app/instance -p 5000:5000 ghcr.io/b1ggi/todo-app:latest
```

---

## ✨ Application Features

🚧 **Under Heavy Development!** 🚧

Stay tuned for more updates and features coming soon!

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
