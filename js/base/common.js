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

/**
 * @description Convert an status string to a status badge (HTML element)
 * @param {string} - The status of the task
 * @returns {string} - HTML badge for the given status
 */
function getTaskStatus(status) {
    if (status === "pending") {
        return `<span class="badge bg-warning text-light">Pending</span>`;
    } else if (status === "overdue") {
        return `<span class="badge bg-danger text-light">Overdue</span>`;
    } else if (status === "in-progress") {
        return `<span class="badge bg-info text-light">In-Progress</span>`;
    } else if (status === "un-assigned") {
        return `<span class="badge bg-secondary text-light">Unassigned</span>`;
    } else {
        return ` <span class="badge bg-success text-light">Completed</span>`;
    }
}