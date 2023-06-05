// Variables
const taskTableBody = document.getElementById('taskTableBody');
const searchInput = document.getElementById('searchInput');
const resultsSelect = document.getElementById('resultsSelect');

// Function to list all tasks
function displayTasks(tasks) {
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
            <a class="btn btn-primary btn-sm" href="edit_task.html?id=${task.id}">Edit</a>
            <button class="btn btn-danger btn-sm" data-id="${task.id}" onclick="confirmDeleteTask(${task.id})">Delete</button>
            </td>
        `;
        taskTableBody.appendChild(row);
    });
}

// Function to filter tasks by ID, Name, or Assigned To
function filterTasks() {
    const limit = parseInt(resultsSelect.value);
    const filterValue = searchInput.value;
    let filteredTasks = getTasksFromLocalStorage();
    if (filterValue !== undefined) {
        filteredTasks = tasks.filter(task => {
            const idMatch = task.id.toString() === filterValue;
            const nameMatch = task.name.toLowerCase().includes(filterValue.toLowerCase());
            const assignedToMatch = task.assignedTo.toLowerCase().includes(filterValue.toLowerCase());
            return idMatch || nameMatch || assignedToMatch;
        });
    }
    const limitedTasks = filteredTasks.slice(0, limit);
    displayTasks(limitedTasks);
}

function confirmDeleteTask(id) { 
    if (confirm("Are you sure? \nYou won't be able to revert this.")) {
        // User clicked "OK"
        const isDelete = deleteTask(id);
        console.log('Is Delete:' + isDelete);
        if (isDelete) {
            setTimeout(()=> {
                alert("Task deleted successfully");
                window.location.reload();
            }, 500)
        }
    }
}

// Search input event listener
searchInput.addEventListener('input', function () {
    filterTasks();
});


// Results select event listener
resultsSelect.addEventListener('change', function () {
    filterTasks();
});

//Load all the tasks
filterTasks();