"use strict";

const userManager = new UserManager();

const createNavBarToDom = () => {
  // Check if the element with id 'modal-window' already exists
  let existingElement = document.getElementById('modal-window');

  // If the element doesn't exist, add it
  if (!existingElement) {
    // Create a new div element
    let newElement = document.createElement('div');
    newElement.classList.add('container');

    // Set the HTML content
    newElement.innerHTML = `    
        <div class="topHeader">
            <a class="brand-name" href="/">
                <img class="d-md-flex" src="../../images/logo.png" alt="Antask">
            </a>
            <div style="margin: auto;"></div>
            <div class="navRight">
                <a href="#" class="toggleMenu d-flex d-sm-none">
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOC4zMDkiIGhlaWdodD0iMTMuMDAzIiB2aWV3Qm94PSIwIDAgMTguMzA5IDEzLjAwMyI+CiAgPGcgaWQ9Ikdyb3VwXzYwOSIgZGF0YS1uYW1lPSJHcm91cCA2MDkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzk1LjA1MyAtMzYuNTMzKSI+CiAgICA8bGluZSBpZD0iTGluZV85NCIgZGF0YS1uYW1lPSJMaW5lIDk0IiB4MT0iMTYuMzA5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzk2LjA1MyAzNy41MzMpIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8bGluZSBpZD0iTGluZV85NSIgZGF0YS1uYW1lPSJMaW5lIDk1IiB4MT0iMTYuMzA5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzk2LjA1MyA0My4wMzQpIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8bGluZSBpZD0iTGluZV85NiIgZGF0YS1uYW1lPSJMaW5lIDk2IiB4MT0iMTYuMzA5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzk2LjA1MyA0OC41MzUpIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPC9nPgo8L3N2Zz4K"
                        alt="">
                </a>
                <div class="mobile-menu d-sm-none" style="display: none;">
                    <div class="mobile-nav">
                        <ul>
                            <li>
                                <a href="">Home</a>
                            </li>
                            <li>
                                <a href="">Tasks</a>
                            </li>
                            <li>
                                <a href="">Members</a>
                            </li>
                            <li>
                                <a href="">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <ul class="navMenu">
            <li ><a href="${ userManager.isAdmin() ? `../dashboard/admin_dashboard.html` : `../dashboard/member_dashboard.html`}">Home</a></li>
            <li ><a href="${ userManager.isAdmin() ? `../task/list_tasks.html` : `../regular/list_tasks.html`}">Tasks</a></li>
            ${ userManager.isAdmin() ? ` <li ><a href="../member/list_members.html">Members</a></li>` : ``}
            <li ><a href="javascript:void(0);" id="logoutLink">Logout</a></li>
        </ul>
    `;    

    // Find the body element in the DOM
    let header = document.getElementById('header');

    // Append the new element to the body
    header.appendChild(newElement);
  } else {
    console.log("Element with id 'navbar' already exists in the DOM.");
  }
}

function handleNavbarToggle(event) {
    const navbar = document.getElementById('navbarNav');
    if (navbar.classList.contains('show')) {
      navbar.classList.remove('show');
    } else {
      navbar.classList.add('show');
    }
}

/*function setDashbaordLink() {
  if (userManager.isLoggedIn()) {
    const loggedInUserInfo = userManager.getCookieValue('userInfo');
    document.getElementById("dashboard-link").href = userManager.getDashboardPage(loggedInUserInfo.type)
  } else {
    userManager.loginPage();
  }
}*/

createNavBarToDom();

const toggleMenu = document.querySelector('.toggleMenu');
toggleMenu.addEventListener('click', function () {
  var mobileMenu = document.querySelector('.mobile-menu');
  if (mobileMenu.style.display === 'none') {
    mobileMenu.style.display = 'block';
  } else {
    mobileMenu.style.display = 'none';
  }
});

//setDashbaordLink();

document.getElementById('logoutLink').addEventListener('click', () => {
  userManager.logout();
});