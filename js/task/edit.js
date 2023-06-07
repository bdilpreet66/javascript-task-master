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
        comments: {},
        hoursWorked: 0,
        owner: getLoggedInUser()
    }
    
    console.log(editTaskDetails);

    editTask(document.getElementById('taskId').textContent, editTaskDetails);
    window.location = "../task/list_tasks.html";
    event.target.reset();
    
    // Reset form validation
    event.target.classList.remove('was-validated');
}

// Add event listener to the form
const editTaskForm = document.getElementById('editTaskForm');
editTaskForm.addEventListener('submit', handleTaskFormSubmit);