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
            <td>${task.assignedTo}</td>
            <td>
            <a class="btn btn-outline-dark btn-sm" href="edit_task.html?id=${task.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg>
            </a>
            <button class="btn btn-outline-danger btn-sm" data-id="${task.id}" onclick="confirmDeleteTask('${task.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
            </svg>
            </button>
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