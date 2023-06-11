'use strict';

// Fetch user data from local storage
const users = userManager.listUsers();

// Variables
const userTableBody = document.getElementById('userTableBody');
const searchInput = document.getElementById('searchInput');
const resultsSelect = document.getElementById('resultsSelect');

let selectedUsers = [];
let selectedUserIds = [];

let page = 0;
let itemsPerPage = 5;
let sortColumn = "email";
let sortOrder = 'asc';

function confirmDeleteUser(email) {
    showMessage('confirm',`Are you sure? \nYou won't be able to revert this.`, function(){
        userManager.deleteUser(email);
        window.location.reload();
    });
}

// Display users
function displayUsers(users) {
    const chevron = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                    </svg>`;
    userTableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `   
            <td data-label="Email" tabindex="0" class="focusable">${user.email} <span class="chevron">${chevron}</span></td>
            <td data-label="Hourly Rate" class="td-hidden">$ ${user.hourlyRate}</td>
            <td data-label="Type" class="td-hidden">${(user.type == "admin") ? `<span class="badge badge-success">Admin</span>` : `<span class="badge badge-dark">Regular</span>`}</td>
            <td data-label="Actions" class="td-hidden">
            <a class="btn btn-outline-dark btn-sm mb-1" href="edit_member.html?email=${user.email}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg>
            </a>
            ${ (userManager.getLoggedInUser() !== user.email) ? `<button class="btn btn-outline-danger btn-sm mb-1" data-id="${user.email}" onclick="confirmDeleteUser('${user.email}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
            </svg>
            </button>`: ``}
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

function displayPaginationButtons(numberOfItems) {
    const pagination = document.getElementById('pagination');
    const numberOfPages = Math.ceil(numberOfItems / itemsPerPage);

    pagination.innerHTML = '';
    
    if (numberOfPages > 1) {
        for (let i = 0; i < numberOfPages; i++) {
            const button = document.createElement('button');
            button.innerText = i + 1;
            button.classList.add("pagination-btn");
            button.addEventListener('click', () => {
                page = i;
                filterUsers();
            });

            if (i === page) {
                button.classList.add('active');
            }

            pagination.appendChild(button);
        }
    }
}


// Filter users by email address
function filterUsers() {
    const searchTerm = searchInput.value.trim();
    itemsPerPage = parseInt(resultsSelect.value);

    let filteredUsers = users;

    // Apply sorting if a sort column is selected
    if (sortColumn !== null) {
        filteredUsers.sort((a, b) => {
            if (a[sortColumn] > b[sortColumn]) {
                return sortOrder === 'asc' ? 1 : -1;
            } else if (a[sortColumn] < b[sortColumn]) {
                return sortOrder === 'asc' ? -1 : 1;
            } else {
                return 0;
            }
        });
    }

    // Apply filtering
    filteredUsers = filteredUsers.filter(user => user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    // Apply pagination
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(start, end);

    displayUsers(paginatedUsers);
    displayPaginationButtons(filteredUsers.length);
}


// Search input event listener
searchInput.addEventListener('input', function () {
    filterUsers();
});


// Results select event listener
resultsSelect.addEventListener('change', function () {
    filterUsers();
});

["email","hourlyRate","type"].forEach(elm => {
    document.getElementById(elm + "-header").addEventListener("click", ()=>{
        if (sortColumn == elm) {
            if (sortOrder == "asc") {
                sortOrder = "desc"
            } else {
                sortOrder = "asc"
            }
        } else {
            sortOrder = "asc"
        }
        sortColumn = elm;
        filterUsers();
    });
})

if (userManager.isAdmin()){
    // Display initial users
    filterUsers();
}
