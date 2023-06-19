const tasksHandler = new TaskManager();

// Get the task id from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const taskID = parseInt(urlParams.get('id'));
const loggedInEmail = userManager.getLoggedInUser();

const workedHoursModal = document.getElementById("workedHoursModal");
const viewLogsModal = document.getElementById("viewLogsModal");
const addHoursBtn = document.getElementById("addHoursBtn");
const workedHoursForm = document.getElementById('workedHoursForm');
const viewLogs = document.getElementById('viewLogs');
const optionSetStage = document.getElementById('optionSetStage');

let taskDetails;
let closeElements = document.querySelectorAll('.close');

const getStatus = (status) => {
    if (status === "pending") {
        return `<span class="badge bg-warning text-light">Pending</span>`;
    } else if (status === "overdue") {
        return `<span class="badge bg-danger text-light">Overdue</span>`;
    } else if (status === "in-progress") {
        return `<span class="badge bg-info text-light">In-Progress</span>`;
    } else if (status === "un-assigned") {
        return `<span class="badge bg-secondary text-light">Unassigned</span>`;
    } else {
        return `<span class="badge bg-success text-light">Completed</span>`;
    }
}

const redirectTaskList = () => { 
    window.location = '../regular/list_tasks.html';
}

const getTimeline = (startDate, endDate, currentDate) => { 
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
  

const getData = () => {
    taskDetails = tasksHandler.getTaskById(taskID);

    if ((taskDetails.assignedTo !== userManager.getLoggedInUser()) && !userManager.isAdmin()) { 
        showMessage('danger','Your are not allowed to access task not assigned to you.', redirectTaskList);
        return;
    }

    if (taskDetails !== null) {
        document.getElementById('taskId').textContent = taskDetails.id;
        document.getElementById('taskName').textContent = taskDetails.name;
        document.getElementById('taskDescription').textContent = taskDetails.description;
        document.getElementById('taskStartDate').textContent = taskDetails.startDate;
        document.getElementById('taskEndDate').textContent = taskDetails.endDate;
        document.getElementById('taskAssignedTo').value = taskDetails.assignedTo;
        document.getElementById('status').innerHTML = getStatus(taskDetails.status);
        document.getElementById('cost').innerHTML = taskDetails.totalCost;
        optionSetStage.value = taskDetails.stage;
        
        document.getElementById('timeline').innerHTML = getTimeline(
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

const loadComments = () => {
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

const calculateTotalCostByID = (taskId, assignedTo) => {
    const workedhours = localStorage.getItem('workedhours');
    const dataArray = workedhours ? JSON.parse(workedhours) : [];
  
    const filteredData = dataArray.filter(data => {
      return parseInt(data.taskID) === parseInt(taskId) && data.assignedTo === assignedTo;
    });
  
    let totalCost = 0;
    filteredData.forEach(data => {
      const hourlyRate = data.hourlyRate;
      const hours = data.hours;
      const minutes = data.minutes;
      const workedHours = parseFloat(hours) + parseFloat(minutes / 60);
      const cost = workedHours * hourlyRate;
      totalCost += cost;
    });
    document.getElementById('cost').textContent = parseFloat(totalCost).toFixed(2);
}
  
const closeWorkedHoursModal = () => { 
    workedHoursModal.style.display = "none";
}

// Handle form submission
const handleHoursFormSubmit = (event) => {
    event.preventDefault();

    // Validate the form
    if (!event.target.checkValidity()) {
        event.stopPropagation();
        event.target.classList.add('was-validated');
        return;
    }

    // Reset form validation
    event.target.classList.remove('was-validated');

    const hours = parseInt(document.getElementById("hours").value)
    const minutes = parseInt(document.getElementById("minutes").value);

    if (hours === 0 && minutes === 0) {
        closeWorkedHoursModal();
        showMessage('danger', `You have entered zero hours worked.`, () => { 
            //workedHoursModal.style.display = "block";
        });
        return;
    }

    const userDetails = userManager.getUser(loggedInEmail);
    const taskID = parseInt(document.getElementById("taskId").textContent);
    const hourlyRate = userDetails.hourlyRate;
    const assignedTo = document.getElementById("taskAssignedTo").value;
    
    try {
        tasksHandler.addWorkedHours(
            taskID,
            assignedTo,
            hourlyRate,
            hours,
            minutes,
            loggedInEmail
        );
        event.target.reset();
        showMessage('success', 'The hours worked have been saved successfully.');
        closeWorkedHoursModal();
        calculateTotalCostByID(taskID, loggedInEmail);
    }
    catch(e) {
        showMessage('danger', `An error occurred. \n ${e}`);
    }
   
}

const viewWorkedHoursLogs = (taskId, assignedTo) => {
    const workedhours = localStorage.getItem('workedhours');
    const dataArray = workedhours ? JSON.parse(workedhours) : [];
  
    const filteredData = dataArray.filter(data => {
      return parseInt(data.taskID) === parseInt(taskId) && data.assignedTo === assignedTo;
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

// Add event listener to the form
workedHoursForm.addEventListener('submit', handleHoursFormSubmit);

addHoursBtn.addEventListener('click', () => {
    workedHoursForm.classList.remove('was-validated');
    workedHoursModal.style.display = "block";
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == workedHoursModal) {
        closeWorkedHoursModal();
    }
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
    viewWorkedHoursLogs(taskID, loggedInEmail)
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
    tasksHandler.editTask(taskID, editTaskDetails);
    window.location.reload();
});

if (userManager.isRegular()) {
    getData();
    calculateTotalCostByID(taskID, loggedInEmail);
} else {
    logout();
}