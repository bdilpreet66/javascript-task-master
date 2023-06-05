"use strict";

if (getTotalUsers() === 0 && !window.location.href.indexOf('setup.html')) {
  deleteCookie('userInfo');
  window.location = '../../templates/setup/setup.html';
}

// Function to create and save a user
function createUser(email, password, type, hourlyRate=0) {
  const user = {
    email,
    password,
    type,
    hourlyRate
  };

  // Save the user to local storage
  let storedUsers = JSON.parse(localStorage.getItem('users')) || [];
  storedUsers.push(user);
  localStorage.setItem('users', JSON.stringify(storedUsers));

  return user;
}

function updateUser(email, hourlyRate, type) {
  let storedUsers = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = storedUsers.findIndex(user => user.email === email);
  if (userIndex !== -1) {
    storedUsers[userIndex].hourlyRate = hourlyRate;
    storedUsers[userIndex].type = type;
    localStorage.setItem('users', JSON.stringify(storedUsers));
    return true;
  }
  return false;
}

function setPassword(email, password) {
  let storedUsers = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = storedUsers.findIndex(user => user.email === email);
  if (userIndex !== -1) {
    storedUsers[userIndex].password = password;
    localStorage.setItem('users', JSON.stringify(storedUsers));
    return true;
  }
  return false;
}


// Function to get a user by email
function getUser(email) {
  const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
  return storedUsers.find(user => user.email === email);
}

// Function to get all user
function listUsers() {
  const storedUsers = localStorage.getItem('users');
  return storedUsers ? JSON.parse(storedUsers) : [];
}

// Function to verify a user
function verifyUser(email, password, hashKey) {
  const user = getUser(email);
  if (user) {
    const hashedPassword = hashPassword(password, hashKey);
    return user.password === hashedPassword;
  }
  return false;
}

// Function to get the total number of users
function getTotalUsers() {
  const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
  return storedUsers.length;
}

// Function to delete a user
function deleteUser(email) {
  let storedUsers = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = storedUsers.findIndex(user => user.email === email);
  if (userIndex !== -1) {
    storedUsers.splice(userIndex, 1);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    return true;
  }
  return false;
}

// Function to check if an email address already exists
function isEmailExists(email) {
  const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
  return storedUsers.some(user => user.email === email);
}

function getDashboardPage(type) {
  return (type === 'admin') ? '../../templates/dashboard/admin_dashboard.html' : '../../templates/dashboard/member_dashboard.html';
}

function isLoggedIn() { 
  return checkCookieExists('userInfo');
}

function getLoggedInUser() {
  if (isLoggedIn()) {
    const loggedInUserInfo = getCookieValue('userInfo');
    return loggedInUserInfo.email;
  }
  loginPage();
}

function isAdmin() { 
  if (isLoggedIn()) {
    const loggedInUserInfo = getCookieValue('userInfo');
    if (loggedInUserInfo) {
      return loggedInUserInfo.type === 'admin';
    }
  }
  loginPage();
}

function loginPage() {
    window.location = '../../templates/index.html';
}

function logout() { 
  deleteCookie('userInfo');
  loginPage();
}