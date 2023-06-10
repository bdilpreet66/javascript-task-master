"use strict";

// Function to retrieve tasks from local storage
function getTasksFromLocalStorage() {
    let storedTasks = localStorage.getItem('tasks');
    storedTasks = storedTasks ? JSON.parse(storedTasks) : [];
    for (let index = 0; index < storedTasks.length; index++) {
        const element = storedTasks[index];
        storedTasks[index] = checkTaskStatus(element);
    }
    return storedTasks;
}

function checkTaskStatus(task) {
    if (task.status != "complete") {
        const end = new Date(task.endDate);
        const cur = new Date();

        if (cur > end) {
            task.status = "overdue";
            editTask(task.id,task)
        }
    }
    return task
}
  
// Function to save tasks to local storage
function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to save a new task
function saveTask(task) {
    tasks.push(task);
    saveTasksToLocalStorage(tasks);
}

// Function to edit a task based on ID
function editTask(id, updatedTask) {
    const tasks = getTasksFromLocalStorage();
    const index = tasks.findIndex(task => task.id == id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updatedTask };
        saveTasksToLocalStorage(tasks);
    } else {
        alert("Task not found!");
    }
}

function addComment(id, comment, time, commentor) {
    const index = tasks.findIndex(task => task.id == id);
    if (index !== -1) {
        tasks[index]["comments"].push({
            message: comment,
            user: commentor,
            time: time.toISOString()
         });
        saveTasksToLocalStorage(tasks);
    } else {
        alert("Task not found!");
    }
}

function listComments(id) {
    const index = tasks.findIndex(task => task.id == id);
    if (index !== -1) {
        return tasks[index]["comments"];
    } else {
        return [];
    }
}


// Function to delete a task
function deleteTask(id) {
    const taskIndex = tasks.findIndex(task => task.id == id);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        return true;
    }
    return false;
  }

// Function to retrieve task details by ID
function getTaskById(id) {
    let task = tasks.find(task => task.id == id);
    task = checkTaskStatus(task)
    if (task) {
        return task;
    } else {
        return null;
    }
}

// Function to check if ID already exists
function isIdExists(id) {
    return tasks.some(task => task.id == id);
}

function populateAssignToMembers() {
    const assignedToSelect = document.getElementById('taskAssignedTo');
    if (assignedToSelect !== null) { 
        listUsers().forEach(user => {
            const option = document.createElement('option');
            option.value = user.email;
            option.textContent = user.email;
            assignedToSelect.appendChild(option);
        });
    }
}

function getStatus(status) {
    if (status == "pending") {
        return `<span class="badge bg-warning text-light">Pending</span>`;
    } else if (status == "overdue") {
        return `<span class="badge bg-danger text-light">Over-Due</span>`;
    } else if (status == "in-progess") {
        return `<span class="badge bg-dark text-light">In-Progess</span>`;
    } else {
        return ` <span class="badge bg-success text-light">Completed</span>`;
    }
}