/**
 * @description Creates a new cookie with a given name, value, and expiration time in hours.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} hours - The number of hours until the cookie expires.
 */
function createCookie(name, value, hours) {
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

/**
 * @description Checks if a cookie with a specified name exists.
 * @param {string} cookieName - The name of the cookie to check.
 * @returns {boolean} - Returns true if the cookie exists, false otherwise.
 */
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


/**
 * @description Retrieves the value of a cookie with a specified name.
 * @param {string} cookieName - The name of the cookie to retrieve.
 * @returns {Object|null} - Returns an object with the email and type properties if the cookie exists, null otherwise.
 */
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

/**
 * @description Deletes a cookie with a specified name.
 * @param {string} cookieName - The name of the cookie to delete.
 */
function deleteCookie(cookieName) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}