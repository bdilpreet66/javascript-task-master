"use strict";

class TaskManager {
    constructor() { 
        this.tasks = [];
        this.change = false;
    }

    getTasksFromLocalStorage() {
        try {
            const storedTasks = localStorage.getItem('tasks');
            this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
            this.tasks = this.tasks.map(task => this.checkTaskStatus(task));
            if (this.change) {
                this.saveTasksToLocalStorage();
                this.change = false;
            }
            return this.tasks;
        } catch(e) {
            console.log(e);
            throw new Error("Error getting tasks from localStorage");
        }
    }

    checkTaskStatus(task) {
        this.change = false;
        if (task.status !== "complete") {
            const end = new Date(task.endDate);
            const cur = new Date();

            if (cur <= end && task.assignedTo === "" && task.status !== "un-assigned") {
                task.status = "un-assigned";
                this.change = true;
            } else if (cur > end && task.status !== "overdue") {
                task.status = "overdue";
                this.change = true;
            }
        }
        return task;
    }

    saveTasksToLocalStorage() {
        try {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        } catch(e) {
            throw new Error("Error updating localStorage");
        }
    }

    getNextId() {
        this.tasks = this.getTasksFromLocalStorage();
        if (this.tasks.length === 0) {
            return 1;
        } else {
            const ids = this.tasks.map(task => parseInt(task.id));
            const maxId = Math.max(...ids);
            return maxId + 1;
        }
    }

    saveTask(task) {
        this.tasks = this.getTasksFromLocalStorage();
        this.tasks.push(task);
        this.saveTasksToLocalStorage();
    }

    editTask(id, updatedTask) {
        this.tasks = this.getTasksFromLocalStorage();
        const index = this.tasks.findIndex(task => parseInt(task.id) === parseInt(id));
        if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...updatedTask };
            this.saveTasksToLocalStorage();
        } else {
            alert("Task not found!");
        }
    }

    addComment(id, comment, time, commentor) {
        this.tasks = this.getTasksFromLocalStorage();
        const index = this.tasks.findIndex(task => parseInt(task.id) === parseInt(id));
        if (index !== -1) {
            if(!this.tasks[index].comments) this.tasks[index].comments = [];
            this.tasks[index].comments.push({ message: comment, user: commentor, time: time.toISOString() });
            this.saveTasksToLocalStorage();
        } else {
            alert("Task not found!");
        }
    }

    listComments(id) {
        this.tasks = this.getTasksFromLocalStorage();
        const index = this.tasks.findIndex(task => parseInt(task.id) === parseInt(id));
        return index !== -1 ? this.tasks[index].comments : [];
    }

    deleteTask(id) {
        this.tasks = this.getTasksFromLocalStorage();
        const taskIndex = this.tasks.findIndex(task => parseInt(task.id) === parseInt(id));
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
            this.saveTasksToLocalStorage();
            return true;
        }
        return false;
    }

    getTaskById(id) {
        this.tasks = this.getTasksFromLocalStorage();
        const task = this.tasks.find(task => parseInt(task.id) === parseInt(id));
        return task ? this.checkTaskStatus(task) : null;
    }

    isIdExists(id) {
        this.tasks = this.getTasksFromLocalStorage();
        return this.tasks.some(task => parseInt(task.id) === parseInt(id));
    }
}