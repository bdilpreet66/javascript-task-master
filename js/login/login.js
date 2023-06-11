'use strict';

const userManager = new UserManager();
const cookieManager = new CookieManager();

if (userManager.checkCookieExists('userInfo') === true) {
    const cookieValue = userManager.getCookieValue('userInfo');
    if (cookieValue) {
        const { email, type } = cookieValue;
        const userDetails = userManager.getUser(email);
        if (email === userDetails.email && type === userDetails.type) {
            window.location = userManager.getDashboardPage(userDetails.type);
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
    event.target.classList.remove('was-validated');

    // Get form values
    const loginEmail = document.getElementById('email').value;
    const loginPassword = document.getElementById('password').value;

    const userDetails = userManager.getUser(loginEmail);
    console.log(userDetails);
    if (userDetails === undefined) { 
        showMessage('danger', 'User not found.')
    }
    else { 
        if (userDetails.password === loginPassword) {
            cookieManager.createCookie('userInfo', JSON.stringify({
                email: loginEmail,
                type: userDetails.type
            }), 24);
            window.location = userManager.getDashboardPage(userDetails.type);
        }
        else {
            showMessage('danger', 'Email Address and Password are invalid.')
        }
    }

}

// Add event listener to the login form
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', handleLoginFormSubmit);