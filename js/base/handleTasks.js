"use strict";

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
    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    saveTasksToLocalStorage(tasks);
    console.log("Task saved successfully!");
}

// Function to edit a task based on ID
function editTask(id, updatedTask) {
    const tasks = getTasksFromLocalStorage();
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updatedTask };
        saveTasksToLocalStorage(tasks);
        console.log("Task updated successfully!");
    } else {
        console.log("Task not found!");
    }
}

// Function to delete a task based on ID
function deleteTask(id) {
    const tasks = getTasksFromLocalStorage();
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
        saveTasksToLocalStorage(tasks);
        return true;
    } else {
        return false;
    }
}