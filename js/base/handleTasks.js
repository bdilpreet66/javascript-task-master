/**
 * @class
 * @classdesc Represents a TaskManager. Manages tasks and their statuses.
 */
class TaskManager {

    /**
     * @constructor
     * @description Initialize tasks array.
     */
    constructor() { 
        this.tasks = [];
    }

    /**
     * @method
     * @description Retrieves tasks from localStorage.
     * @returns {Array.<Object>} The tasks from localStorage.
     * @throws Will throw an error if localStorage retrieval fails.
     */
    getTasksFromLocalStorage() {
        try {
            const storedTasks = localStorage.getItem('tasks');
            this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
            this.tasks = this.tasks.map(task => this.checkTaskStatus(task));
            this.saveTasksToLocalStorage();
            return this.tasks;
        } catch {
            throw new Error("Error getting tasks from localStorage");
        }
    }

    /**
     * @method
     * @description Checks a task's status based on various conditions.
     * @param {Object} task The task to check.
     * @returns {Object} The updated task object.
     */
    checkTaskStatus(task) {
        if (task.status !== "completed") {            
            const end = new Date(task.endDate);
            end.setDate(end.getDate() + 2);
            const cur = new Date();

            if (cur <= end && task.assignedTo === "" && task.status !== "un-assigned") {
                task.status = "un-assigned";
            } else if (cur > end && task.status !== "overdue") {
                task.status = "overdue";
            }
        }
        return task;
    }

    /**
     * @method
     * @description Saves the tasks array to localStorage.
     * @throws Will throw an error if localStorage update fails.
     */
    saveTasksToLocalStorage() {
        try {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        } catch(e) {
            throw new Error("Error updating localStorage");
        }
    }

    /**
     * @method
     * @description Computes the next available ID for a new task.
     * @returns {number} The next available ID.
     */
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

    /**
     * @method
     * @description Saves a new task.
     * @param {Object} task The task to save.
     */
    saveTask(task) {
        this.tasks = this.getTasksFromLocalStorage();
        this.tasks.push(task);
        this.saveTasksToLocalStorage();
    }

    /**
     * @method
     * @description Edits an existing task.
     * @param {string} id The ID of the task to edit.
     * @param {Object} updatedTask The new task data.
     */
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

    /**
     * @method
     * @description Adds a comment to a task.
     * @param {string} id The ID of the task to add the comment to.
     * @param {string} comment The comment to add.
     * @param {Date} time The time the comment was added.
     * @param {string} commentor The user who added the comment.
     */
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

    /**
     * @method
     * @description Lists all comments for a task.
     * @param {string} id The ID of the task.
     * @returns {Array.<Object>} The comments for the task.
     */
    listComments(id) {
        this.tasks = this.getTasksFromLocalStorage();
        const index = this.tasks.findIndex(task => parseInt(task.id) === parseInt(id));
        return index !== -1 ? this.tasks[index].comments : [];
    }

    /**
     * @method
     * @description Deletes a task.
     * @param {string} id The ID of the task to delete.
     * @returns {boolean} True if the task was deleted, false otherwise.
     */
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

    /**
     * @method
     * @description Fetches a task by its ID.
     * @param {string} id The ID of the task to fetch.
     * @returns {Object|null} The task, or null if not found.
     */
    getTaskById(id) {
        this.tasks = this.getTasksFromLocalStorage();
        const task = this.tasks.find(task => parseInt(task.id) === parseInt(id));
        return task ? this.checkTaskStatus(task) : null;
    }

    /**
     * @method
     * @description Checks if a task ID already exists.
     * @param {string} id The ID to check.
     * @returns {boolean} True if the ID exists, false otherwise.
     */
    isIdExists(id) {
        this.tasks = this.getTasksFromLocalStorage();
        return this.tasks.some(task => parseInt(task.id) === parseInt(id));
    }

    /**
     * @method
     * @description Adds worked hours to a task.
     * @param {string} taskID The ID of the task.
     * @param {string} assignedTo The user to whom the task was assigned.
     * @param {number} hourlyRate The hourly rate for the task.
     * @param {number} hours The hours worked.
     * @param {number} minutes The minutes worked.
     * @param {string} createdBy The user who created the task.
     */
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

    /**
     * @method
     * @description Updates the total cost of a task.
     * @param {string} taskID The ID of the task.
     */
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