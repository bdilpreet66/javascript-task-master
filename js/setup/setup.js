(function() {
    // Get the total no of users
    if (getTotalUsers() > 0) {
        window.location = '../../templates/index.html';
    }

    function redirect() { 
        window.location = '../../templates/dashboard/admin_dashboard.html';
    }

    // Handle form submission
    function handleSetupFormSubmit(event) {
        event.preventDefault();

        // Validate the form
        if (!event.target.checkValidity()) {
            event.stopPropagation();
            event.target.classList.add('was-validated');
            return;
        }

        // Get form values
        //const companyName = document.getElementById('companyName').value;
        //const userName = document.getElementById('userName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            document.getElementById('confirmPassword').setCustomValidity("Passwords do not match");
            event.target.classList.add('was-validated');
            return;
        }

        // Reset form validation
        event.target.classList.remove('was-validated');
        event.target.reset();

        // Save user
        const type = 'admin';
        createUser(email,password,type);

        const loggedInUser = {
            email: email,
            type: type
        };

        createCookie('userInfo', JSON.stringify(loggedInUser), 24);

        // Display success message or redirect to another page
        showMessage('success','Admin account was added successfully.', redirect)
    }
    
    // Add event listener to the setup form
    const setupForm = document.getElementById('setupForm');
    setupForm.addEventListener('submit', handleSetupFormSubmit);

})();