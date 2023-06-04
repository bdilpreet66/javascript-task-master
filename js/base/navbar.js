"use strict";

function handleNavbarToggle(event) {
    const navbar = document.getElementById('navbarNav');
    if (navbar.classList.contains('show')) {
      navbar.classList.remove('show');
    } else {
      navbar.classList.add('show');
    }
}

function setDashbaordLink() {
  if (isLoggedIn()) {
    const loggedInUserInfo = getCookieValue('userInfo');
    document.getElementById("dashboard-link").href = getDashboardPage(loggedInUserInfo.type)
  } else {
    loginPage();
  }
}

// Add event listener to the navbar toggler
const navbarToggler = document.querySelector('.navbar-toggler');
navbarToggler.addEventListener('click', handleNavbarToggle);
setDashbaordLink()