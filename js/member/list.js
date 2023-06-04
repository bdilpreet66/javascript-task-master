// Fetch user data from local storage
const users = listUsers();

// Variables
const userTableBody = document.getElementById('userTableBody');
const searchInput = document.getElementById('searchInput');
const resultsSelect = document.getElementById('resultsSelect');

let selectedUsers = [];
let selectedUserIds = [];

// Display users
function displayUsers(users) {
    userTableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `   
            <td>${user.email}</td>
            <td>$ ${user.hourlyRate}</td>
            <td>${(user.type == "admin") ? `<span class="badge badge-success">Admin</span>` : `<span class="badge badge-info">Regular</span>`}</td>
            <td>
            <a class="btn btn-primary btn-sm" href="edit_member.html?email=${user.email}">Edit</a>
            <button class="btn btn-danger btn-sm" data-id="${user.email}" onclick="deleteUser(${user.email})">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

// Filter users by email address
function filterUsers() {
    const limit = parseInt(resultsSelect.value);
    const searchTerm = searchInput.value.trim();
    const filteredUsers = users.filter(user => user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    const limitedUsers = filteredUsers.slice(0, limit);

    displayUsers(limitedUsers);
}

// Search input event listener
searchInput.addEventListener('input', function () {
    filterUsers();
});


// Results select event listener
resultsSelect.addEventListener('change', function () {
    filterUsers();
});

// Display initial users
if (isAdmin()){
    filterUsers(users);
} else {
    loginPage();
}
