// Populate user emails for the Assign To field
populateAssignToMembers();

// Get the task id from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const taskID = urlParams.get('id');

const taskDetails = getTaskById(taskID);
if (taskDetails !== null) {
    document.getElementById('taskId').textContent = taskDetails.id;
    document.getElementById('taskName').value = taskDetails.name;
    document.getElementById('taskDescription').value = taskDetails.description;
    document.getElementById('taskStartDate').value = taskDetails.startDate;
    document.getElementById('taskEndDate').value = taskDetails.endDate;
    document.getElementById('taskAssignedTo').value = taskDetails.assignedTo;
}
else { 
    alert(`Task ID ${taskID} not found.`);
}

// Handle form submission
function handleTaskFormSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    // Validate the form
    if (!event.target.checkValidity()) {
        event.stopPropagation();
        event.target.classList.add('was-validated');
        return;
    }

    // Get form values
    const editTaskDetails = {
        id: document.getElementById('taskId').textContent,
        name: document.getElementById('taskName').value,
        description: document.getElementById('taskDescription').value,
        startDate: document.getElementById('taskStartDate').value,
        endDate: document.getElementById('taskEndDate').value,
        assignedTo: document.getElementById('taskAssignedTo').value,
        comments: taskDetails.comments,
        hoursWorked: taskDetails.hoursWorked,
        status: taskDetails.status,
        daily_cost: taskDetails.daily_cost,
        total_cost: taskDetails.total_cost,
        owner: getLoggedInUser()
    }

    editTask(taskDetails.id, editTaskDetails);
    window.location = "../task/list_tasks.html";
    event.target.reset();
    
    // Reset form validation
    event.target.classList.remove('was-validated');
}

document.getElementById("commentBtn").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    let comment = document.getElementById("commentField").value;
    let date = new Date();
    let commentor = getLoggedInUser();

    if (comment != "" && commentor) {
        addComment(taskDetails.id, comment, date, commentor);
        document.getElementById("commentField").value = "";
        loadComments()
    } else {

    }

})

function loadComments(){
    let list = document.getElementById("comments-list");
    list.innerHTML = "";
    let comments = listComments(taskDetails.id);
    if (comments.length) {
    console.log(comments)
        for (let index = 0; index < comments.length; index++) {
            const comment = comments[index];
            let li = document.createElement("li");
            li.classList.add("Comment-box");
            li.innerHTML = `
            <p class="comment-message">${comment.message}</p>
            <div class="row justify-content-end mb-3">
                <span class="comment-details">${comment.user} | ${formatDateTime(comment.time)}</span>
            </div>`;
            list.appendChild(li);
        }
    } else {
        let li = document.createElement("li");
        li.classList.add("Comment-box");
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

// Add event listener to the form
const editTaskForm = document.getElementById('editTaskForm');
editTaskForm.addEventListener('submit', handleTaskFormSubmit);
loadComments();