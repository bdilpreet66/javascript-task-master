/**
 * @class UserManager
 * @description This class provides methods for managing users, such as creating, updating, and deleting users. It also includes methods for checking the logged-in status of users.
 */
class UserManager {

  /**
   * @constructor
   * @description Upon instantiation, checks for total users and current URL to redirect to appropriate page.
   */
  constructor() {
    if (this.getTotalUsers() === 0 && !window.location.href.includes('setup.html')) {
      deleteCookie('userInfo');
      window.location = '../../templates/setup/setup.html';
    } else if (!this.isLoggedIn() 
            && !window.location.href.includes('index.html') 
            && !window.location.href.includes('setup.html')) {
      this.loginPage();
    }
  }

  /**
   * @method createUser
   * @description Creates a new user and saves it to local storage.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @param {string} type - The type of the user.
   * @param {number} [hourlyRate=0] - The hourly rate of the user.
   * @returns {Object} The user that was created.
   */
  createUser(email, password, type, hourlyRate = 0) {
    const user = {
      email,
      password,
      type,
      hourlyRate: parseFloat(hourlyRate).toFixed(2)
    };
    let storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    storedUsers.push(user);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    return user;
  }

  /**
   * @method updateUser
   * @description Updates an existing user's hourly rate.
   * @param {string} email - The email of the user to update.
   * @param {number} hourlyRate - The new hourly rate.
   * @returns {boolean} True if the user was updated successfully, false otherwise.
   */
  updateUser(email, hourlyRate) {
    let storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = storedUsers.findIndex(user => user.email === email);
    if (userIndex !== -1) {
      storedUsers[userIndex].hourlyRate = parseFloat(hourlyRate).toFixed(2);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      return true;
    }
    return false;
  }

  /**
   * @method setPassword
   * @description Sets a new password for an existing user.
   * @param {string} email - The email of the user to update.
   * @param {string} password - The new password.
   * @returns {boolean} True if the password was set successfully, false otherwise.
   */
  setPassword(email, password) {
    let storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = storedUsers.findIndex(user => user.email === email);
    if (userIndex !== -1) {
      storedUsers[userIndex].password = password;
      localStorage.setItem('users', JSON.stringify(storedUsers));
      return true;
    }
    return false;
  }

  /**
   * @method getUser
   * @description Fetches a user from local storage based on email.
   * @param {string} email - The email of the user to fetch.
   * @returns {Object|null} The user object or null if not found.
   */
  getUser(email) {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    return storedUsers.find(user => user.email === email);
  }

  /**
   * @method listUsers
   * @description Fetches all users from local storage.
   * @returns {Array} The list of users.
   */
  listUsers() {
    let storedUsers = localStorage.getItem('users');
    storedUsers = storedUsers ? JSON.parse(storedUsers) : [];
    return storedUsers;
  }

  /**
   * @method getTotalUsers
   * @description Fetches the total number of users from local storage.
   * @returns {number} The total number of users.
   */
  getTotalUsers() {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    return storedUsers.length;
  }

  /**
   * @method deleteUser
   * @description Deletes a user from local storage.
   * @param {string} email - The email of the user to delete.
   * @returns {boolean} True if the user was deleted successfully, false otherwise.
   */
  deleteUser(email) {
    let storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = storedUsers.findIndex(user => user.email === email);
    if (userIndex !== -1) {
      storedUsers.splice(userIndex, 1);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      return true;
    }
    return false;
  }

  /**
   * @method isEmailExists
   * @description Checks if a user with a given email exists in local storage.
   * @param {string} email - The email to check.
   * @returns {boolean} True if the email exists, false otherwise.
   */
  isEmailExists(email) {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    return storedUsers.some(user => user.email === email);
  }

  /**
   * @method getDashboardPage
   * @description Returns the appropriate dashboard page based on the type of user.
   * @param {string} type - The type of the user.
   * @returns {string} The URL of the dashboard page.
   */
  getDashboardPage(type) {
    return (type === 'admin') ? '../templates/admin/dashboard/dashboard.html' : '../templates/regular/dashboard/dashboard.html';
  }

  /**
   * @method isLoggedIn
   * @description Checks if a user is currently logged in.
   * @returns {boolean} True if a user is logged in, false otherwise.
   */
  isLoggedIn() { 
    return checkCookieExists('userInfo');
  }

  /**
   * @method getLoggedInUser
   * @description Fetches the currently logged in user.
   * @returns {string|null} The email of the logged in user, or null if no user is logged in.
   */
  getLoggedInUser() {
    if (this.isLoggedIn()) {
      const loggedInUserInfo = getCookieValue('userInfo');
      return loggedInUserInfo.email;
    }
    this.loginPage();
  }

  /**
   * @method isAdmin
   * @description Checks if the currently logged in user is an admin.
   * @returns {boolean} True if the logged in user is an admin, false otherwise.
   */
  isAdmin() { 
    if (this.isLoggedIn()) {
      const loggedInUserInfo = getCookieValue('userInfo');
      if (loggedInUserInfo) {
        return loggedInUserInfo.type === 'admin';
      }
    }
    this.loginPage();
  }

  /**
   * @method isRegular
   * @description Checks if the currently logged in user is a regular user.
   * @returns {boolean} True if the logged in user is a regular user, false otherwise.
   */
  isRegular() { 
    if (this.isLoggedIn()) {
      const loggedInUserInfo = getCookieValue('userInfo');
      if (loggedInUserInfo) {
        return loggedInUserInfo.type === 'regular';
      }
    }
    this.loginPage();
  }

  /**
   * @method loginPage
   * @description Redirects the user to the login page.
   */
  loginPage() {
    window.location = '../../../templates/index.html?loginPage';
  }

  /**
   * @method logout
   * @description Logs out the current user and redirects them to the login page.
   */
  logout() { 
    deleteCookie('userInfo');
    this.loginPage();
  }
}