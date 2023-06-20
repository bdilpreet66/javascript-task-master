const tasksHandler = new TaskManager();

const taskTableBody = document.getElementById('taskTableBody');
const searchInput = document.getElementById('searchInput');
const resultsSelect = document.getElementById('resultsSelect');

let tasks = [];

const getAllTasks = () => {
    tasks = tasksHandler.getTasksFromLocalStorage().filter(task => task.status === "overdue" || task.status === "in-progress");

    // Sort tasks based on endDate in ascending order
    tasks.sort((task1, task2) => new Date(task1.endDate) - new Date(task2.endDate));

    // Retrieve the top 5 tasks based on endDate
    // const topTasks = tasks.slice(0, 5);

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
                <td data-label="Status" class="td-hidden">${getTaskStatus(task.status)}</td>
                <td data-label="Actions" class="td-hidden">
                <a class="btn btn-outline-dark btn-sm mb-1" href="../task/edit_task.html?id=${task.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
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

const getTasksTotal = () => { 
    
    const storedTasks = localStorage.getItem('tasks');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];

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

const calculateTotalCost = () => { 
    const workedhours = localStorage.getItem('workedhours');
    const dataArray = workedhours ? JSON.parse(workedhours) : [];
  
    let totalIncome = 0;
    dataArray.forEach(data => {
      const hourlyRate = data.hourlyRate;
      const hours = data.hours;
      const minutes = data.minutes;
      const workedHours = parseFloat(hours) + parseFloat(minutes / 60);
      const cost = workedHours * hourlyRate;
      totalIncome += cost;
    });
    document.getElementById('totalIncome').textContent = `$ ${parseFloat(totalIncome).toFixed(2)}`;
}

if (userManager.isAdmin()) {
    getAllTasks();
    getTasksTotal();
    calculateTotalCost();
} else {
    logout();
}
