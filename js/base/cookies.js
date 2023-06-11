"use strict";

class CookieManager {
  
  createCookie(name, value, hours) {
    const expires = new Date();
    expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
    //alert("saving cookie");
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  checkCookieExists(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${cookieName}=`)) {
        return true;
      }
    }
    return false;
  }

  getCookieValue(cookieName) {
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

  deleteCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

}
