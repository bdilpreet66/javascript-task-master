// Get the total no of users
if (getTotalUsers() === 0) {
    deleteCookie('userInfo');
    window.location = '../../templates/setup/setup.html';
}
else {
    if (checkCookieExists('userInfo') === true) {
        const cookieValue = getCookieValue('userInfo');
        if (cookieValue) {
            const { email, type } = cookieValue;
            const userDetails = getUser(email);
            if (email === userDetails.email && type === userDetails.type) {
                window.location = getDashboardPage(userDetails.type);
            }
        }
    }

    // Handle form submission
    function handleLoginFormSubmit(event) {
        event.preventDefault();
  
        // Validate the form
        if (!event.target.checkValidity()) {
          event.stopPropagation();
          event.target.classList.add('was-validated');
          return;
        }

        // Reset form validation
        event.target.reset();
        event.target.classList.remove('was-validated');
  
        // Get form values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const userDetails = getUser(email);
        if (userDetails.password === password) {
            window.location = getDashboardPage(userDetails.type);
        }
        else {
            alert('Invalid user');
        }
  
    }
  
    // Add event listener to the login form
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLoginFormSubmit);


}