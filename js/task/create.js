// Populate user emails for the Assign To field
populateAssignToMembers();

// Function to generate a new ID for a task
function generateNewId() {
    const maxId = tasks.reduce((max, task) => (task.id > max ? task.id : max), 0);
    const newId = parseInt(maxId) + 1;
    return newId;
}

function redirect() { 
    window.location = `../task/edit_task.html?id=${taskID}`;
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
    const taskID = generateNewId();
    if (!isIdExists(taskID)) {
        // Get form values
        const newTask = {
            id: taskID,
            name: document.getElementById('taskName').value,
            description: document.getElementById('taskDescription').value,
            startDate: document.getElementById('taskStartDate').value,
            endDate: document.getElementById('taskEndDate').value,
            assignedTo: document.getElementById('taskAssignedTo').value,
            comments: [],
            status: "pending",
            dailyCost: [],
            totalCost: 0,
            hoursWorked: 0,
            owner: getLoggedInUser()
        }
        
        saveTask(newTask);
        showMessage('success','Task was created successfully.', redirect);
        event.target.reset();
    }
    else {
        showMessage('danger', `Task ID ${taskID} already exists.`, '');
    }

    // Reset form validation
    event.target.classList.remove('was-validated');
}

// Add event listener to the form
const addTaskForm = document.getElementById('addTaskForm');
addTaskForm.addEventListener('submit', handleTaskFormSubmit);

// Auto-fill the Task ID
document.getElementById('taskId').textContent = generateNewId();