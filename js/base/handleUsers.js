
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

// Function to get a user by email
function getUser(email) {
  const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
  return storedUsers.find(user => user.email === email);
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

// Function to generate a hash key
function generateHashKey() {
  // Simulated hash key generation
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Function to hash a password
function hashPassword(password, hashKey) {
  // Simulated password hashing
  return CryptoJS.MD5(password + hashKey).toString();
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
  if (userIndex !== -1 && storedUsers[userIndex].type !== 'admin') {
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

/*
// Function to save user info in cookies (simulated)
function saveUserInfoInLocalStorage(user) {
  // Save user info to local storage
  localStorage.setItem('userInfo', JSON.stringify(user));
}

// Function to retrieve user info from local storage
function getUserInfoFromLocalStorage() {
  return JSON.parse(localStorage.getItem('userInfo'));
}

// Function to clear user info from local storage
function clearUserInfoFromLocalStorage() {
  localStorage.removeItem('userInfo');
}
*/

// Function to create a cookie
function createCookie(name, value, hours) {
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Function to check if a cookie exists
function checkCookieExists(cookieName) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${cookieName}=`)) {
      return true;
    }
  }
  return false;
}

// Function to get the value of a cookie and extract email and type
function getCookieValue(cookieName) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${cookieName}=`)) {
      const cookieValue = cookie.substring(cookieName.length + 1);
      const userInfo = JSON.parse(cookieValue);
      const { email, type } = userInfo;
      return { email, type };
    }
  }
  return null;
}

// Function to delete a cookie
function deleteCookie(cookieName) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function getDashboardPage(type) {
  return (type === 'admin') ? '../../templates/dashboard/admin_dashboard.html' : '../../templates/dashboard/member_dashboard.html';
}

// Example usage:

// Register a new user
//const newUser = createUser('user@example.com', 'password', 'regular');

// Save user info in local storage
//saveUserInfoInLocalStorage(newUser);

// Retrieve user info from local storage
//const userInfo = getUserInfoFromLocalStorage();