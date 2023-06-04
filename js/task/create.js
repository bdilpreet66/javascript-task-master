document.addEventListener('DOMContentLoaded', function() {
    const users = listUsers();
    console.log(users);
    const assignedToSelect = document.getElementById('taskAssignedTo');

    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.email;
        option.textContent = user.email;
        assignedToSelect.appendChild(option);
    });
});

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
    const newTask = {
        id: document.getElementById('taskId').value,
        name: document.getElementById('taskName').value,
        description: document.getElementById('taskDescription').value,
        startDate: document.getElementById('taskStartDate').value,
        endDate: document.getElementById('taskEndDate').value,
        assignedTo: document.getElementById('taskAssignedTo').value,
        comments: document.getElementById('taskComments').value,
        hoursWorked: 0,
        owner: 'sbabaran@gmail.com'
    }
    
    saveTask(newTask);
    alert('Member created successfully!');
    window.location = "../task/list_tasks.html";
    event.target.reset();
    
    // Reset form validation
    event.target.classList.remove('was-validated');
}

// Add event listener to the form
const addTaskForm = document.getElementById('addTaskForm');
addTaskForm.addEventListener('submit', handleTaskFormSubmit);