"use strict";

class TaskManager {
    constructor() { }

    getTasksFromLocalStorage() {
        const storedTasks = localStorage.getItem('tasks');
        let tasks = storedTasks ? JSON.parse(storedTasks) : [];
        return tasks.map(this.checkTaskStatus);
    }

    checkTaskStatus(task) {
        if (task.status !== "complete") {
            const end = new Date(task.endDate);
            const cur = new Date();

            if (cur > end) {
                task.status = "overdue";
                this.editTask(task.id, task);
            }
        }
        return task;
    }

    saveTasksToLocalStorage() {
        console.log(this.tasks)
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
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