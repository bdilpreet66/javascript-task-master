"use strict";
class UserManager extends CookieManager {

  constructor() {
    super();
    if (this.getTotalUsers() === 0 && !window.location.href.includes('setup.html')) {
      this.deleteCookie('userInfo');
      window.location = '../../templates/setup/setup.html';
    }
  }

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

  updateUser(email, hourlyRate, type) {
    let storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = storedUsers.findIndex(user => user.email === email);
    if (userIndex !== -1) {
      storedUsers[userIndex].hourlyRate = parseFloat(hourlyRate).toFixed(2);
      storedUsers[userIndex].type = type;
      localStorage.setItem('users', JSON.stringify(storedUsers));
      return true;
    }
    return false;
  }

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

  getUser(email) {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    return storedUsers.find(user => user.email === email);
  }

  listUsers() {
    let storedUsers = localStorage.getItem('users');
    storedUsers = storedUsers ? JSON.parse(storedUsers) : [];
    return storedUsers;
  }

  getTotalUsers() {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    return storedUsers.length;
  }

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

  isEmailExists(email) {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    return storedUsers.some(user => user.email === email);
  }

  getDashboardPage(type) {
    return (type === 'admin') ? '../templates/dashboard/admin_dashboard.html' : '../templates/dashboard/member_dashboard.html';
  }

  isLoggedIn() { 
    return this.checkCookieExists('userInfo');
  }

  getLoggedInUser() {
    if (this.isLoggedIn()) {
      const loggedInUserInfo = this.getCookieValue('userInfo');
      return loggedInUserInfo.email;
    }
    this.loginPage();
  }

  isAdmin() { 
    if (this.isLoggedIn()) {
      const loggedInUserInfo = this.getCookieValue('userInfo');
      if (loggedInUserInfo) {
        return loggedInUserInfo.type === 'admin';
      }
    }
    this.loginPage();
  }

  loginPage() {
    window.location = '../../templates/index.html?loginPage';
  }

  logout() { 
    this.deleteCookie('userInfo');
    this.loginPage();
  }
}