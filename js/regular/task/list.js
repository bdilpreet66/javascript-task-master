const tasksHandler = new TaskManager();

const loggedInEmail = userManager.getLoggedInUser();

const taskTableBody = document.getElementById('taskTableBody');
const searchInput = document.getElementById('searchInput');
const resultsSelect = document.getElementById('resultsSelect');

let page = 0;
let itemsPerPage = 10;
let sortColumn = "startDate";
let sortOrder = 'asc';

const getStatus = status => {
    switch(status) {
        case "pending":
            return `<span class="badge bg-warning text-light">Pending</span>`;
        case "overdue":
            return `<span class="badge bg-danger text-light">Overdue</span>`;
        case "in-progress":
            return `<span class="badge bg-info text-light">In-Progress</span>`;
        case "un-assigned":
            return `<span class="badge bg-secondary text-light">Unassigned</span>`;
        default:
            return ` <span class="badge bg-success text-light">Completed</span>`;
    }
}

const displayTasks = tasks => {
    taskTableBody.innerHTML = '';

    if (tasks.length > 0){
        const chevron = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                    </svg>`;
        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `   
                <td data-label="Task ID #" tabindex="0" class="focusable">${task.id} <span class="chevron">${chevron}</span></td>
                <td data-label="Name" tabindex="0" class="focusable">${task.name}</td>
                <td data-label="Start Date" class="td-hidden">${task.startDate}</td>
                <td data-label="End Date" class="td-hidden">${task.endDate}</td>
                <td data-label="Assigned To" class="td-hidden">${task.assignedTo}</td>
                <td data-label="Status" class="td-hidden">${getStatus(task.status)}</td>
                <td data-label="Actions" class="td-hidden">
                <a class="btn btn-outline-dark btn-sm mb-1" href="view_task.html?id=${task.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                    </svg>
                </a>
                </td>
            `;
            taskTableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7">No tasks yet</td>`
        taskTableBody.appendChild(row);
    }
}

const displayPaginationButtons = numberOfItems => {
    const pagination = document.getElementById('pagination');
    const numberOfPages = Math.ceil(numberOfItems / itemsPerPage);

    pagination.innerHTML = '';

    if (numberOfPages > 1) {
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
}

const getMemberTasks = () => { 
    const storedTasks = localStorage.getItem('tasks');
    this.tasks = storedTasks ? JSON.parse(storedTasks) : [];

    // Filter tasks based on assignedTo
    if (loggedInEmail) {
        this.tasks = this.tasks.filter(task => task.assignedTo === loggedInEmail);
    }

    this.tasks = this.tasks.map(task => tasksHandler.checkTaskStatus(task));

    if (this.change) {
        this.saveTasksToLocalStorage();
        this.change = false;
    }

    return this.tasks;
}

const filterTasks = () => {
    const searchTerm = searchInput.value.trim();
    itemsPerPage = parseInt(resultsSelect.value);

    let filteredTasks = getMemberTasks();

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

const confirmDeleteTask = id => { 
    showMessage('confirm', "Are you sure you want to delete?<br>You won't be able to revert it.", () => {
        tasksHandler.deleteTask(id);
        filterTasks();
        showMessage('success', "The task was deleted successfully.");
    });
}

searchInput.addEventListener('input', filterTasks);
resultsSelect.addEventListener('change', filterTasks);

if (loggedInEmail) {
    ["id","name","startDate","endDate","assignedTo","status"].forEach(elm => {
        document.getElementById(`${elm}-header`).addEventListener("click", () => {
            sortOrder = (sortColumn === elm && sortOrder === "asc") ? "desc" : "asc";
            sortColumn = elm;
            filterTasks();
        });
    })

    filterTasks();
}
