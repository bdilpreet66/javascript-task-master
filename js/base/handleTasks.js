"use strict";

const tasks = getTasksFromLocalStorage();

// Function to retrieve tasks from local storage
function getTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
}
  
// Function to save tasks to local storage
function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to save a new task
function saveTask(task) {
    tasks.push(task);
    saveTasksToLocalStorage(tasks);
    console.log("Task saved successfully!");
}

// Function to edit a task based on ID
function editTask(id, updatedTask) {
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updatedTask };
        saveTasksToLocalStorage(tasks);
    } else {
        alert("Task not found!");
    }
}

// Function to delete a task
function deleteTask(id) {
    const taskIndex = tasks.findIndex(task => parseInt(task.id) === parseInt(id));
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        return true;
    }
    return false;
  }

// Function to retrieve task details by ID
function getTaskById(id) {
    const task = tasks.find(task => parseInt(task.id) === parseInt(id));
    if (task) {
        return task;
    } else {
        return null;
    }
}

// Function to check if ID already exists
function isIdExists(id) {
    return tasks.some(task => parseInt(task.id) === parseInt(id));
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