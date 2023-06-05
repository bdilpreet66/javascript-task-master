// Get the user email from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');

// Switch between tabs
function switchTab(activeLinkId, activeContentId) {
    const tabLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-pane');
  
    // Remove 'active' class from all tab links and contents
    tabLinks.forEach(link => link.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'))
  
    // Add 'active' class to the clicked tab link and corresponding content
    const activeTabLink = document.getElementById(activeLinkId);
    const activeTabContent = document.getElementById(activeContentId);

    activeTabLink.classList.add('active');
    activeTabContent.classList.add('active', 'show');
}

// Function to populate the form fields with user data
function populateFormData(user) {
    // Populate hourly rate and member type
    document.getElementById('hourlyRate').value = user.hourlyRate;
    document.getElementById('memberType').value = user.type;
}

// Function to handle the rate and type form submission
function handleRateTypeFormSubmit(event) {
    event.preventDefault();

    // Validate the form
    if (!event.target.checkValidity()) {
        event.stopPropagation();
        event.target.classList.add('was-validated');
        return;
    }

    // Get the updated hourly rate and member type
    const hourlyRate = document.getElementById('hourlyRate').value;
    const memberType = document.getElementById('memberType').value;

    // Update the user data with the new values
    const updatedUser = updateUser(email, hourlyRate, memberType);
    if (updatedUser) {
        // Display a success message or perform any additional actions
        alert('Hourly rate and member type updated');
    }
}

// Function to handle the password form submission
function handlePasswordFormSubmit(event) {
    event.preventDefault();

    // Validate the form
    if (!event.target.checkValidity()) {
        event.stopPropagation();
        event.target.classList.add('was-validated');
        return;
    }

    // Get the new password and confirm password
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Check if the passwords match
    if (newPassword !== confirmPassword) {
        // Display an error message or perform any additional actions
        alert('Passwords do not match');
        return;
    }

    // Update the user password with the new value
    const updatedUser = setPassword(email, newPassword);
    if (updatedUser) {
        // Display a success message or perform any additional actions
        alert('Password updated');
    }
}


if (isAdmin()) {
    // Get the user data
    const user = getUser(email);

    // Populate the form fields with user data
    populateFormData(user);

    // Add event listeners to the forms
    const rateTypeForm = document.getElementById('rateTypeForm');
    rateTypeForm.addEventListener('submit', handleRateTypeFormSubmit);

    const passwordForm = document.getElementById('passwordForm');
    passwordForm.addEventListener('submit', handlePasswordFormSubmit);
}