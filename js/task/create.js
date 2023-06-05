// Populate user emails for the Assign To field
populateAssignToMembers();

// Handle form submission
function handleTaskFormSubmit(event) {
    event.preventDefault();

    // Validate the form
    if (!event.target.checkValidity()) {
        event.stopPropagation();
        event.target.classList.add('was-validated');
        return;
    }

    if (isIdExists()) {
        // Get form values
        const taskID = document.getElementById('taskId').value;
        const newTask = {
            id: taskID,
            name: document.getElementById('taskName').value,
            description: document.getElementById('taskDescription').value,
            startDate: document.getElementById('taskStartDate').value,
            endDate: document.getElementById('taskEndDate').value,
            assignedTo: document.getElementById('taskAssignedTo').value,
            comments: {},
            hoursWorked: 0,
            owner: getLoggedInUser()
        }
        
        saveTask(newTask);
        alert('Task created successfully!');
        window.location = "../task/list_tasks.html";
        event.target.reset();
    }
    else { 
        alert(`Task ID ${taskID} already exists.`);
    }

    // Reset form validation
    event.target.classList.remove('was-validated');
}

// Add event listener to the form
const addTaskForm = document.getElementById('addTaskForm');
addTaskForm.addEventListener('submit', handleTaskFormSubmit);