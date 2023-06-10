'use strict';

// Variables
const taskTableBody = document.getElementById('taskTableBody');
const searchInput = document.getElementById('searchInput');
const resultsSelect = document.getElementById('resultsSelect');

let page = 0;
let itemsPerPage = 10;
let sortColumn = "email";
let sortOrder = 'asc';

function redirect() { 
    window.location = '../task/list_task.html';
}

// Function to list all tasks
function displayTasks(tasks) {
    taskTableBody.innerHTML = '';

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `   
            <td data-label="Task ID">${task.id}</td>
            <td data-label="Name">${task.name}</td>
            <td data-label="Start Date">${task.startDate}</td>
            <td data-label="End Date">${task.endDate}</td>
            <td data-label="Assigned To">${task.assignedTo}</td>
            <td data-label="Status">${getStatus(task.status)}</td>
            <td data-label="Actions">
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

function displayPaginationButtons(numberOfItems) {
    const pagination = document.getElementById('pagination');
    const numberOfPages = Math.ceil(numberOfItems / itemsPerPage);

    pagination.innerHTML = '';

    for (let i = 0; i < numberOfPages; i++) {
        const button = document.createElement('button');
        button.innerText = i + 1;
        button.classList.add("pagination-btn");
        button.addEventListener('click', () => {
            page = i;
            filterTasks();
        });

        if (i === page) {
            button.classList.add('active');
        }

        pagination.appendChild(button);
    }
}

// Function to filter tasks by ID, Name, or Assigned To
function filterTasks() {
    const searchTerm = searchInput.value.trim();
    itemsPerPage = parseInt(resultsSelect.value);

    let filteredTasks = tasks;

    // Apply sorting if a sort column is selected
    if (sortColumn !== null) {
        filteredTasks.sort((a, b) => {
            if (a[sortColumn] > b[sortColumn]) {
                return sortOrder === 'asc' ? 1 : -1;
            } else if (a[sortColumn] < b[sortColumn]) {
                return sortOrder === 'asc' ? -1 : 1;
            } else {
                return 0;
            }
        });
    }

    // Apply filtering
    filteredTasks = filteredTasks.filter(task => {
        const idMatch = task.id.toString() === searchTerm;
        const nameMatch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
        const assignedToMatch = task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
        return idMatch || nameMatch || assignedToMatch;
    });

    // Apply pagination
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedTasks = filteredTasks.slice(start, end);

    displayTasks(paginatedTasks);
    displayPaginationButtons(filteredTasks.length);
}

function confirmDeleteTask(id) { 
    showMessage('confirm', "Are you sure you want to delete?\n You won't be able to revert it.", () => {
        deleteTask(id);
    });
    showMessage('success', "The task was deleted successfully.", redirect);
}

// Search input event listener
searchInput.addEventListener('input', function () {
    filterTasks();
});


// Results select event listener
resultsSelect.addEventListener('change', function () {
    filterTasks();
});

["id","name","startDate","endDate","assignedTo","status"].forEach(elm => {
    document.getElementById(elm + "-header").addEventListener("click", ()=>{
        if (sortColumn == elm) {
            if (sortOrder == "asc") {
                sortOrder = "desc"
            } else {
                sortOrder = "asc"
            }
        } else {
            sortOrder = "asc"
        }
        sortColumn = elm;
        filterTasks();
    });
})

//Load all the tasks
filterTasks();