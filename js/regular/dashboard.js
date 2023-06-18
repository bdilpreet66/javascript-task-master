const tasksHandler = new TaskManager();

const loggedInEmail = userManager.getLoggedInUser();

const taskTableBody = document.getElementById('taskTableBody');
const searchInput = document.getElementById('searchInput');
const resultsSelect = document.getElementById('resultsSelect');

let tasks;

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
            return `<span class="badge bg-success text-light">Completed</span>`;
    }
}

const getMemberTasks = () => { 
    
    const storedTasks = localStorage.getItem('tasks');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];

    // Filter tasks based on assignedTo and status
    if (loggedInEmail) {
        tasks = tasks.filter(task => task.assignedTo === loggedInEmail && (task.status === "overdue" || task.status === "in-progress"));
    }

    // Sort tasks based on endDate in ascending order
    tasks.sort((task1, task2) => new Date(task1.endDate) - new Date(task2.endDate));

    // Retrieve the top 5 tasks based on endDate
    const topTasks = tasks.slice(0, 5);

    taskTableBody.innerHTML = '';

    if (topTasks.length > 0){
        const chevron = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                    </svg>`;
        topTasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `   
                <td data-label="Task ID #" tabindex="0" class="focusable">${task.id} <span class="chevron">${chevron}</span></td>
                <td data-label="Name" tabindex="0" class="focusable">${task.name}</td>
                <td data-label="Start Date" class="td-hidden">${task.startDate}</td>
                <td data-label="End Date" class="td-hidden">${task.endDate}</td>
                <td data-label="Assigned To" class="td-hidden">${task.assignedTo}</td>
                <td data-label="Status" class="td-hidden">${getStatus(task.status)}</td>
                <td data-label="Actions" class="td-hidden">
                <a class="btn btn-outline-dark btn-sm mb-1" href="../../regular/task/view_task.html?id=${task.id}">
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

const getMemberTasksTotal = () => { 
    
    const storedTasks = localStorage.getItem('tasks');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];

    // Filter tasks based on assignedTo and status
    if (loggedInEmail) {
        tasks = tasks.filter(task => task.assignedTo === loggedInEmail);
    }

    let totalCount = 0;
    let pendingCount = 0;
    let inprogressCount = 0;
    let overdueCount = 0;
    let completedCount = 0;
    tasks.forEach(task => {
        totalCount++;
        if (task.status === 'completed') { 
            completedCount++;
        }
        if (task.status === 'pending') { 
            pendingCount++;
        }
        if (task.status === 'in-progress') { 
            inprogressCount++;
        }
        if (task.status === 'overdue') { 
            overdueCount++;
        }
    });
    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('completedCount').textContent = completedCount;
    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('inprogressCount').textContent = inprogressCount;
    document.getElementById('overdueCount').textContent = overdueCount;
}

const calculateTotalIncome = () => { 
    const workedhours = localStorage.getItem('workedhours');
    const dataArray = workedhours ? JSON.parse(workedhours) : [];
  
    const filteredData = dataArray.filter(data => {
      return data.assignedTo === loggedInEmail;
    });
  


    let totalIncome = 0;
    filteredData.forEach(data => {
      const hourlyRate = data.hourlyRate;
      const hours = data.hours;
      const minutes = data.minutes;
      const workedHours = parseFloat(hours) + parseFloat(minutes / 60);
      const cost = workedHours * hourlyRate;
      totalIncome += cost;
    });
    document.getElementById('totalIncome').textContent = `$ ${parseFloat(totalIncome).toFixed(2)}`;
}

if (loggedInEmail) {
    getMemberTasks();
    getMemberTasksTotal();
    calculateTotalIncome();
}
