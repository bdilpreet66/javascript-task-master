/**
 * Create a new instance of UserManager
 */
const userManager = new UserManager();

/**
 * @description Convert an ISO formatted date and time string to a more readable format
 * @param {string} isoString - The ISO 8601 date and time string to format
 * @returns {string} - The formatted date and time string in the format 'day month, year hours:minutes'
 */
const formatDateTime = (isoString) => {
    let date = new Date(isoString);
    
    // Array of month names
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Get the day, month, year, hours, and minutes
    let day = date.getDate();
    let month = monthNames[date.getMonth()];
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    
    // Format the date and time string
    return `${day} ${month}, ${year} ${hours}:${minutes}`;
}