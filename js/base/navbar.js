"use strict";

function handleNavbarToggle(event) {
    const navbar = document.getElementById('navbarNav');
    if (navbar.classList.contains('show')) {
      navbar.classList.remove('show');
    } else {
      navbar.classList.add('show');
    }
}

  // Add event listener to the navbar toggler
const navbarToggler = document.querySelector('.navbar-toggler');
navbarToggler.addEventListener('click', handleNavbarToggle);