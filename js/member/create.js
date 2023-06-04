// Handle form submission
function handleRegistrationFormSubmit(event) {
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
    if (isEmailExists(email)) {
        alert('Email already exists!');
    }
    else {
        createUser(email, password, type, hourlyRate);
        alert('Member created successfully!');
        window.location = "../member/list_members.html";
        event.target.reset();
    }

    // Reset form validation
    event.target.classList.remove('was-validated');
}

// Add event listener to the registration form
if (isAdmin()){
    const registrationForm = document.getElementById('registrationForm');
    registrationForm.addEventListener('submit', handleRegistrationFormSubmit);
}