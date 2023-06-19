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
        } catch {
            throw new Error("Error getting tasks from localStorage");
        }
    }

    checkTaskStatus(task) {
        this.change = false;
        if (task.status !== "completed") {            
            const end = new Date(task.endDate);
            end.setDate(end.getDate() + 2);
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

    addWorkedHours(taskID, assignedTo, hourlyRate, hours, minutes, createdBy) {
        const time = new Date();
        const data = {
            taskID: taskID,
            assignedTo: assignedTo,
            hourlyRate: hourlyRate,
            hours: hours,
            minutes: minutes,
            dateCreated: time.toISOString(),
            createdBy: createdBy
        };
        
        const workedhours = localStorage.getItem('workedhours');
        let dataArray = workedhours ? JSON.parse(workedhours) : [];
        dataArray.push(data);
        localStorage.setItem('workedhours', JSON.stringify(dataArray));

        this.updateTotalCost(taskID);
    }

    updateTotalCost(taskID) { 
        const workedhours = localStorage.getItem('workedhours');
        const dataArray = workedhours ? JSON.parse(workedhours) : [];
    
        const filteredData = dataArray.filter(item => item.taskID === taskID);
    
        let totalCost = 0;
        let totalHoursWorked = 0;
        filteredData.forEach(data => {
            const hourlyRate = data.hourlyRate;
            const hours = data.hours;
            const minutes = data.minutes;
            const workedHours = parseFloat(hours) + parseFloat(minutes / 60);
            const cost = workedHours * hourlyRate;
            totalCost += cost;
            totalHoursWorked += workedHours;
        });

        const taskDetails = this.getTaskById(taskID);
        
        const editTaskDetails = {
            id: taskDetails.id,
            name: taskDetails.name,
            description: taskDetails.description,
            startDate: taskDetails.startDate,
            endDate: taskDetails.endDate,
            assignedTo: taskDetails.assignedTo,
            comments: taskDetails.comments,
            totalHoursWorked: totalHoursWorked,
            status: taskDetails.status,
            totalCost: totalCost,
            owner: taskDetails.owner
        }
        
        this.editTask(taskID, editTaskDetails);
    } 
}