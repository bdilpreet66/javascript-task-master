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

const toggleMenu = document.querySelector('.toggleMenu');
toggleMenu.addEventListener('click', function () {
  var mobileMenu = document.querySelector('.mobile-menu');
  if (mobileMenu.style.display === 'none') {
    mobileMenu.style.display = 'block';
  } else {
    mobileMenu.style.display = 'none';
  }
});

setDashbaordLink()