// Fetch user data from local storage
const tasks = getTasksFromLocalStorage();

// Variables
const taskTableBody = document.getElementById('taskTableBody');

// Function to list all tasks
function displayTasks() {
    //const tasks = getTasksFromLocalStorage();
    taskTableBody.innerHTML = '';

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `   
            <td>${task.id}</td>
            <td>${task.name}</td>
            <td>${task.startDate}</td>
            <td>${task.endDate}</td>
            <td>${task.owner}</td>
            <td>
            <a class="btn btn-primary btn-sm" href="edit_task.html?email=${task.id}">Edit</a>
            <button class="btn btn-danger btn-sm" data-id="${task.id}" onclick="confirmDeleteTask(${task.id})">Delete</button>
            </td>
        `;
        taskTableBody.appendChild(row);
    });
}

function confirmDeleteTask(id) { 
    if (confirm("Are you sure? \nYou won't be able to revert this.")) {
        // User clicked "OK"
        if (deleteTask(id)) {
            setTimeout(()=> {
                alert("Task deleted successfully");
                window.location.reload();
            }, 500)
        }
    }
}

displayTasks();

