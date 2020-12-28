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
            editing: false,
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
            this.displayedTasks[taskID].style.backgroundColor = 'lightgreen';
        } else {
            this.displayedTasks[taskID].style.textDecoration = 'none';
            this.displayedTasks[taskID].style.background = 'none';
        }
        this.saveToLocalStorage();
        
    },
    getSavedTasks() {
        if(localStorage.getItem('tasks')) {
            this.tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        return;
        
    },
    createElementHandler (index) {
        return `
            <div class="task">
                <p onclick="toDoApp.markAsDone(${index})">${this.tasks[index].taskTekst}</p>
                <button class="task-edit-btn" onclick="toDoApp.editTask(${index})"></button>
                <button class="task-remove-btn" onclick="toDoApp.deleteTask(${index})"></button>
            </div>
        `
    },
    showTasks() {
        this.tasksContainer.innerHTML = '';
        for (let i = 0; i < this.tasks.length; i++) {
            this.tasksContainer.innerHTML += this.createElementHandler(i);
            if(this.tasks[i].taskDone) {
                this.displayedTasks[i].style.textDecoration = 'line-through';
                this.displayedTasks[i].style.backgroundColor = 'lightgreen';
            }    
        }
    },
    editTask(taskID) {
        this.tasks.forEach((t, i) => {
            if (t.editing) {
                t.editing = false;
                this.displayedTasks[i].style.background = 'none';
                this.displayedTasks[i].outerHTML = this.createElementHandler(i);
            }
        });
        this.tasks[taskID].editing = true;
        this.tasks[taskID].taskDone = false;
        this.displayedTasks[taskID].style.textDecoration = 'none';
        this.displayedTasks[taskID].style.backgroundColor = '#fffce3';
        this.saveToLocalStorage();
        const textHeight = this.displayedTasks[taskID].querySelector('p').getClientRects()[0].height;
        this.displayedTasks[taskID].innerHTML = `
            <textarea class="task-edit-input" oninput="toDoApp.autoResize(this)" style="min-height: ${textHeight}px">${this.tasks[taskID].taskTekst}</textarea>
            <button class="task-save-btn" onclick="toDoApp.saveChange(${taskID})"></button>
        `;
        const textElement = this.displayedTasks[taskID].querySelector('textarea');
        textElement.focus();
        textElement.setSelectionRange(textElement.value.length,textElement.value.length);
    },
    autoResize(el) {
        el.style.height = (el.scrollHeight)+'px';
    },
    saveChange(taskID) {
        const updatedTask = this.displayedTasks[taskID].querySelector('textarea').value;
        this.tasks[taskID].taskTekst = updatedTask;
        this.tasks.forEach(t => t.editing = false);
        this.displayedTasks[taskID].style.background = 'none';
        this.saveToLocalStorage();
        this.showTasks();
    },
    deleteTask(taskID) {
        this.tasks.splice(taskID, 1);
        this.saveToLocalStorage();
        this.showTasks();
    }
};

toDoApp.getSavedTasks();
toDoApp.showTasks();