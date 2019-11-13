'use strict';

let toDoApp = {
    tasks: [],
    newTask: document.getElementById('newTaskInput'),
    tasksContainer: document.querySelector('.task-list'),
    displayedTasks: document.getElementsByClassName('task'),
    addTask() {
        if(this.newTask.value.length < 1) {
            return;
        }
        this.tasks.push({
            taskTekst: this.newTask.value,
            taskDone: false
        });
        this.saveToLocalStorage();
        this.showTasks();
        this.newTask.value = '';
        this.newTask.focus();
    },
    trigEnKey(event) {
        if(event.keyCode === 13) {
            this.addTask();
        }
    },
    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
    markAsDone(taskID) {
        let task = this.tasks[taskID];
        task.taskDone = !task.taskDone;
        if(task.taskDone) {
            this.displayedTasks[taskID].style.textDecoration = 'line-through';
        } else {
            this.displayedTasks[taskID].style.textDecoration = 'none';
        }
        this.saveToLocalStorage();
        
    },
    getSavedTasks() {
        if(localStorage.getItem('tasks')) {
            this.tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        return;
        
    },
    showTasks() {
        this.tasksContainer.innerHTML = '';
        for (let i = 0; i < this.tasks.length; i++) {
            this.tasksContainer.innerHTML += `
                <div class="task">
                    <p onclick="toDoApp.markAsDone(${i})">${this.tasks[i].taskTekst}</p>
                    <button class="task-remove-btn" onclick="toDoApp.deleteTask(${i})"></button>
                </div>
            `;
            if(this.tasks[i].taskDone) {
                this.displayedTasks[i].style.textDecoration = 'line-through';
            }    
        }
    },
    deleteTask(taskID) {
        this.tasks.splice(taskID, 1);
        this.saveToLocalStorage();
        this.showTasks();
    }
};

toDoApp.getSavedTasks();
toDoApp.showTasks();