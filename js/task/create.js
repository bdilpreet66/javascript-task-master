// Populate user emails for the Assign To field
populateAssignToMembers();

// Function to generate a new ID for a task
function generateNewId() {
    const maxId = tasks.reduce((max, task) => (task.id > max ? task.id : max), 0);
    const newId = parseInt(maxId) + 1;
    return newId;
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
    const taskID = document.getElementById('taskId').value;
    if (!isIdExists(taskID)) {
        // Get form values
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

// Auto-fill the Task ID
document.getElementById('taskId').value = generateNewId();