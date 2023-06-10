const tasksHandler = new TaskManager();

// Get the task id from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const taskID = parseInt(urlParams.get('id'));

let taskDetails;

const populateAssignToMembers = () => {
    const assignedToSelect = document.getElementById('taskAssignedTo');
    if (assignedToSelect !== null) {
        listUsers().forEach(user => {
            const option = document.createElement('option');
            option.value = user.email;
            option.textContent = user.email;
            if (taskDetails.assignedTo == user.email) {
                option.selected = true;
            }
            assignedToSelect.appendChild(option);
        });
    }
};

function getStatus(status) {
    if (status === "pending") {
        return `<span class="badge bg-warning text-light">Pending</span>`;
    } else if (status === "overdue") {
        return `<span class="badge bg-danger text-light">Over-Due</span>`;
    } else if (status === "in-progess") {
        return `<span class="badge bg-dark text-light">In-Progess</span>`;
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
        hoursWorked: taskDetails.hoursWorked,
        status: taskDetails.status,
        dailyCost: taskDetails.dailyCost,
        totalCost: taskDetails.totalCost,
        owner: getLoggedInUser()
    }


    try{
        tasksHandler.editTask(taskDetails.id, editTaskDetails);
        getData();

        showMessage('success', 'Task was saved successfully.');

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
    let commentor = getLoggedInUser();

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
        li.textContent = "No Comments Yet!";
        list.appendChild(li)
    }
}

function formatDateTime(isoString) {
    let date = new Date(isoString);
    
    // Array of month names
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Get the day, month, year, hours, and minutes
    let day = date.getDate();
    let month = monthNames[date.getMonth()];
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    
    // Format the date and time string
    return `${day} ${month}, ${year} ${hours}:${minutes}`;
}


if (isAdmin()) {
    getData();
    const editTaskForm = document.getElementById('editTaskForm');
    document.getElementById("saveTaskBtn").addEventListener('click', handleTaskFormSubmit);
    populateAssignToMembers();
}