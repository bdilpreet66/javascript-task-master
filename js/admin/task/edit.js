const tasksHandler = new TaskManager();

// Get the task id from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const taskID = parseInt(urlParams.get('id'));
const viewLogsModal = document.getElementById("viewLogsModal");
const viewLogs = document.getElementById('viewLogs');
const optionSetStage = document.getElementById('optionSetStage');
let closeElements = document.querySelectorAll('.close');

let taskDetails;


const populateAssignToMembers = () => {
    const assignedToSelect = document.getElementById('taskAssignedTo');
    if (assignedToSelect !== null) {
        userManager.listUsers().forEach(user => {
            if (user.type === 'regular') { 
                const option = document.createElement('option');
                option.value = user.email;
                option.textContent = user.email;
                if (taskDetails.assignedTo == user.email) {
                    option.selected = true;
                }
                assignedToSelect.appendChild(option);
            }
        });
    }
};

function getStatus(status) {
    if (status === "pending") {
        return `<span class="badge bg-warning text-light">Pending</span>`;
    } else if (status === "overdue") {
        return `<span class="badge bg-danger text-light">Overdue</span>`;
    } else if (status === "in-progress") {
        return `<span class="badge bg-info text-light">In-Progress</span>`;
    } else if (status === "un-assigned") {
        return `<span class="badge bg-secondary text-light">Unassigned</span>`;
    } else {
        return ` <span class="badge bg-success text-light">Completed</span>`;
    }
}

function getTimeline(startDate, endDate, currentDate) {
    // Convert dates to milliseconds
    const startMs = startDate.getTime();
    const endMs = endDate.getTime();
    const currentMs = currentDate.getTime();
  
    // Calculate the total duration in milliseconds
    const totalDuration = endMs - startMs;
  
    // Calculate the elapsed duration in milliseconds
    const elapsedDuration = currentMs - startMs;
  
    // Calculate the progress percentage
    let progressPercentage = Math.floor((elapsedDuration / totalDuration) * 100);
  
    progressPercentage = (progressPercentage > 100) ? 100 : progressPercentage;
    
    return `<div class="progress-bar bg-dark" style="width:${progressPercentage}%" role="progressbar"></div>`;
  }
  

function getData() {
    taskDetails = tasksHandler.getTaskById(taskID);

    if (taskDetails !== null) {
        document.getElementById('taskId').textContent = taskDetails.id;
        document.getElementById('taskName').value = taskDetails.name;
        document.getElementById('taskDescription').value = taskDetails.description;
        document.getElementById('taskStartDate').value = taskDetails.startDate;
        document.getElementById('taskEndDate').value = taskDetails.endDate;
        document.getElementById("status").innerHTML = getStatus(taskDetails.status);
        document.getElementById("cost").innerHTML = taskDetails.totalCost;
        document.getElementById("timeline").innerHTML = getTimeline(
                new Date(taskDetails.startDate), 
                new Date(taskDetails.endDate), 
                new Date()
            );

        loadComments();
    }
    else { 
        alert(`Task ID ${taskID} not found.`);
    }
}

// Handle form submission
function handleTaskFormSubmit(event) {
    event.preventDefault();

    // Validate the form
    if (!editTaskForm.checkValidity()) {
        event.stopPropagation();
        editTaskForm.classList.add('was-validated');
        return;
    }

    // Get form values
    const editTaskDetails = {
        id: taskDetails.id,
        name: document.getElementById('taskName').value,
        description: document.getElementById('taskDescription').value,
        startDate: document.getElementById('taskStartDate').value,
        endDate: document.getElementById('taskEndDate').value,
        assignedTo: document.getElementById('taskAssignedTo').value,
        comments: taskDetails.comments,
        totalHoursWorked: taskDetails.totalHoursWorked,
        status: taskDetails.status,
        stage: taskDetails.stage,
        totalCost: taskDetails.totalCost,
        owner: userManager.getLoggedInUser()
    }

    if ((new Date(editTaskDetails.startDate)) >= (new Date(editTaskDetails.endDate))) {
        event.stopPropagation();
        showMessage('danger', 'Start date must be less than end date.');
        editTaskForm.classList.add('was-validated');
        return;
    }

    try{
        tasksHandler.editTask(taskDetails.id, editTaskDetails);
        getData();

        showMessage('success', 'Task was saved successfully.', () => {window.location.reload();});

        editTaskForm.classList.remove('was-validated');
    } catch {
        showMessage('danger', 'Error Updating Tasks.');
    }
}

document.getElementById("commentBtn").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    let comment = document.getElementById("commentField").value;
    let date = new Date();
    let commentor = userManager.getLoggedInUser();

    if (comment != "" && commentor) {
        tasksHandler.addComment(taskDetails.id, comment, date, commentor);
        document.getElementById("commentField").value = "";
        loadComments()
    } else {

    }

})

function loadComments(){
    let list = document.getElementById("comments-list");
    list.innerHTML = "";
    let comments = tasksHandler.listComments(taskDetails.id);
    if (comments.length) {
        for (let index = 0; index < comments.length; index++) {
            const comment = comments[index];
            let li = document.createElement("li");
            li.classList.add("comment-box");
            li.innerHTML = `
            <p class="comment-message">${comment.message}</p>
            <div class="row justify-content-end mb-3">
                <span class="comment-details">${comment.user} | ${formatDateTime(comment.time)}</span>
            </div>`;
            list.appendChild(li);
        }
    } else {
        let li = document.createElement("li");
        li.classList.add("comment-box");
        li.textContent = "No comments yet";
        list.appendChild(li)
    }
}

const viewWorkedHoursLogs = (taskId) => {
    const workedhours = localStorage.getItem('workedhours');
    const dataArray = workedhours ? JSON.parse(workedhours) : [];
  
    const filteredData = dataArray.filter(data => {
      return parseInt(data.taskID) === parseInt(taskId);
    });
  
    const table = document.createElement('table');
    table.classList.add('table');
    table.classList.add('table-striped');

    // Create table header
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Hourly Rate', 'Hours', 'Minutes', 'Cost', 'Date Added', 'Added By'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);

  // Create table body
    const tableBody = document.createElement('tbody');
    const dataFields = ['hourlyRate', 'hours', 'minutes', 'cost', 'dateCreated', 'createdBy'];
    let totalHours = 0;
    let totalCost = 0;
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        dataFields.forEach((header,index) => {
            const cell = document.createElement('td');
            cell.setAttribute('data-label',headers[index]);
            let tdValue = item[header];
            if (header === 'cost') {
                const workedHours = parseFloat(item['hours']) + parseFloat(item['minutes'] / 60);
                const cost = workedHours * item['hourlyRate'];
                tdValue = parseFloat(cost).toFixed(2);
                totalCost += parseFloat(tdValue);
            }
            if (header === 'dateCreated') { 
                tdValue = formatDateTime(tdValue);
            }
            if (header === 'hours') { 
                totalHours += parseInt(tdValue);
            }
            if (header === 'minutes') { 
                totalHours += parseFloat(tdValue / 60);
            }
            cell.textContent = tdValue;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
    table.appendChild(tableBody);
     
    // Append table to the document
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = `<p>Total Hours: <strong>${parseFloat(totalHours).toFixed(2)}</strong> Total Cost: $ <strong>${parseFloat(totalCost).toFixed(2)}</strong></p>`;
    tableContainer.appendChild(table);
    viewLogsModal.style.display = 'block';
}

// Loop over each 'close' element
closeElements.forEach((closeElement) => {
    // Attach a click event listener
    closeElement.addEventListener('click', function () {
        // Find the closest parent with class 'modal'
        let parentModal = closeElement.closest('.modal');
        // If such a parent element exists
        if (parentModal !== null) {
            // Make the parent modal visible
            parentModal.style.display = "none";
        }
    });
});

viewLogs.addEventListener('click', (e) => { 
    e.preventDefault();
    viewWorkedHoursLogs(taskID)
});

optionSetStage.addEventListener('change', () => {
    const taskDetails = tasksHandler.getTaskById(taskID);
    // Get form values
    const editTaskDetails = {
        id: taskDetails.id,
        name: taskDetails.name,
        description: taskDetails.description,
        startDate: taskDetails.startDate,
        endDate: taskDetails.endDate,
        assignedTo: taskDetails.assignedTo,
        comments: taskDetails.comments,
        totalHoursWorked: taskDetails.totalHoursWorked,
        status: optionSetStage.value === '' ? 'pending' : optionSetStage.value,
        stage: optionSetStage.value,
        totalCost: taskDetails.totalCost,
        owner: userManager.getLoggedInUser()
    }
    tasksHandler.editTask(taskID,editTaskDetails);
    window.location.reload();
});

if (userManager.isAdmin()) {
    getData();
    const editTaskForm = document.getElementById('editTaskForm');
    document.getElementById("saveTaskBtn").addEventListener('click', handleTaskFormSubmit);
    populateAssignToMembers();
}