const redirect = () => { 
    window.location = '../member/list_members.html';
}

// Handle form submission
const handleRegistrationFormSubmit = (event) => {
    event.preventDefault();

    // Validate the form
    if (!event.target.checkValidity()) {
      event.stopPropagation();
      event.target.classList.add('was-validated');
      return;
    }

    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const type = document.getElementById('type').value;
    const hourlyRate = document.getElementById('hourlyRate').value;

    // TODO: Perform registration and further actions
    if (userManager.isEmailExists(email)) {
        showMessage('danger', 'The email address already exists.');
    }
    else {
        try {
            userManager.createUser(email, password, type, hourlyRate);
            showMessage('success', 'Member was created successfully.', redirect);
            event.target.reset();
        }
        catch (e) {
            showMessage('danger', `An error occurred. \n ${e}`, '');
        }
    }

    // Reset form validation
    event.target.classList.remove('was-validated');
}

if (userManager.isAdmin()){
    // Add event listener to the registration form
    const registrationForm = document.getElementById('registrationForm');
    registrationForm.addEventListener('submit', handleRegistrationFormSubmit);
}