/**
 * @description Logs the user out by calling the logout method on userManager
 * @returns {void}
 */
const logout = () => {
  userManager.logout();
};

/**
 * @description Toggles visibility of the mobile menu
 * @returns {void}
 */
const handleMobileMenuToggle = () => {
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenu.style.display === 'none') {
    mobileMenu.style.display = 'block';
  } else {
    mobileMenu.style.display = 'none';
  }
};

/**
 * @description Checks if an element with the id 'modal-window' exists, if not creates a new div with content and appends it to an element with the id 'header'
 * @returns {void}
 */
const createNavBarToDom = () => {
  const existingElement = document.getElementById('modal-window');
  
  if (!existingElement) {
    const newElement = document.createElement('div');
    newElement.classList.add('container');

    newElement.innerHTML = `    
        <div class="topHeader">
            <a class="brand-name" href="/">
                <img class="d-md-flex" src="../../../images/logo.png" alt="Antask">
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
                                <a href="${ userManager.isAdmin() ? `../../admin/dashboard/dashboard.html` : `../../regular/dashboard/dashboard.html`}">Home</a>
                            </li>
                            <li>
                                <a href="${ userManager.isAdmin() ? `../../admin/task/list_tasks.html` : `../../regular/task/list_tasks.html`}">Tasks</a>
                            </li>
                            ${ userManager.isAdmin() ? ` <li ><a href="../../admin/member/list_members.html">Members</a></li>` : ``}
                            <li>
                                <a href="javascript:void(0);" onclick="logout()">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <ul class="navMenu">
            <li ><a href="${ userManager.isAdmin() ? `../../admin/dashboard/dashboard.html` : `../../regular/dashboard/dashboard.html`}">Home</a></li>
            <li ><a href="${ userManager.isAdmin() ? `../../admin/task/list_tasks.html` : `../../regular/task/list_tasks.html`}">Tasks</a></li>
            ${ userManager.isAdmin() ? ` <li ><a href="../../admin/member/list_members.html">Members</a></li>` : ``}
            <li ><a href="javascript:void(0);" onclick="logout()">Logout</a></li>
        </ul>
    `; 

    document.getElementById('header').appendChild(newElement);

    // Add event listener to '.toggleMenu' after the new element has been appended to the DOM
    const toggleMenu = document.querySelector('.toggleMenu');
    toggleMenu.addEventListener('click', handleMobileMenuToggle);
  } else {
    console.log("Element with id 'navbar' already exists in the DOM.");
  }
};

createNavBarToDom();
