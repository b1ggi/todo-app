// Funktion zum Hinzufügen einer Aufgabe
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskTitle = taskInput.value;

    if (taskTitle) {
        fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `title=${taskTitle}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Task added!") {
                location.reload();  // Seite neu laden, um die neue Aufgabe anzuzeigen
            }
        });
    }
}

// Funktion zum Löschen einer Aufgabe
function deleteTask(taskId) {
    fetch(`/delete/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Task deleted!") {
            const taskElement = document.getElementById(`task-${taskId}`);
            taskElement.remove();  // Die gelöschte Aufgabe aus der Liste entfernen
        }
    });
}

// Funktion zum Bearbeiten einer Aufgabe
function editTask(taskId) {
    const taskTitleElement = document.getElementById(`task-title-${taskId}`);
    const editInputElement = document.getElementById(`edit-task-input-${taskId}`);
    
    if (editInputElement.style.display === 'none') {
        editInputElement.value = taskTitleElement.textContent;
        taskTitleElement.style.display = 'none';
        editInputElement.style.display = 'inline';
    } else {
        const newTitle = editInputElement.value;
        fetch(`/update/${taskId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `title=${newTitle}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Title updated!") {
                taskTitleElement.textContent = newTitle;
                taskTitleElement.style.display = 'inline';
                editInputElement.style.display = 'none';
            }
        });
    }
}

// Funktion zum Erledigen einer Aufgabe
function completeTask(taskId){
    fetch(`/update/${taskId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `complete=True`
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Task completed!") {
            location.reload();  // Seite neu laden, um die aktualisierte Aufgabe anzuzeigen
        }
    });
}

// Funktion zum Wiederherstellen einer Aufgabe
function restoreTask(taskId){
    fetch(`/update/${taskId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `complete=False`
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Task restored!") {
            location.reload();  // Seite neu laden, um die aktualisierte Aufgabe anzuzeigen
        }
    });
}

// Event listener for Enter key on task input field
document.getElementById('taskInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Event listener for Enter key on edit input fields
document.querySelectorAll('[id^="edit-task-input-"]').forEach(function(input) {
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const taskId = this.id.split('-').pop();
            editTask(taskId);
        }
    });
});