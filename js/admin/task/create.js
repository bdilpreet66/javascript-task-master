const tasksHandler = new TaskManager();

const populateAssignToMembers = () => {
    const assignedToSelect = document.getElementById('taskAssignedTo');
    if (assignedToSelect !== null) {
        userManager.listUsers().forEach(user => {
            if (user.type === 'regular') { 
                const option = document.createElement('option');
                option.value = user.email;
                option.textContent = user.email;
                assignedToSelect.appendChild(option);
            }
        });
    }
};

// Handle form submission
const handleTaskFormSubmit = event => {
    event.preventDefault();

    // Validate the form
    if (!event.target.checkValidity()) {
        event.stopPropagation();
        event.target.classList.add('was-validated');
        return;
    }

    const taskID = tasksHandler.getNextId();

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
        totalCost: 0.0,
        hoursWorked: 0,
        owner: userManager.getLoggedInUser()
    };

    if ((new Date(editTaskDetails.startDate)) >= (new Date(editTaskDetails.endDate))) {
        event.stopPropagation();
        showMessage('danger', 'Start date must be less than end date.');
        editTaskForm.classList.add('was-validated');
        return;
    }

    try{
        tasksHandler.saveTask(newTask);

        showMessage('success', 'Task was created successfully.', () => {
            window.location = `../task/edit_task.html?id=${taskID}`;
        });
    } catch {
        showMessage('danger', 'Error Creating Tasks.');
    }
};

if (userManager.isAdmin()) {
    // Add event listener to the form
    const addTaskForm = document.getElementById('addTaskForm');
    addTaskForm.addEventListener('submit', handleTaskFormSubmit);

    // Auto-fill the Task ID
    document.getElementById('taskId').textContent = tasksHandler.getNextId();

    // Show availeble team members
    populateAssignToMembers();
}
