const showMessage = (type, message) => {
    const modal = document.getElementById("modal-window");
    const modalIcon = document.getElementById("modal-icon");
    const modalMessage = document.getElementById("modal-message");
    const modalBtnOk = document.getElementById("modal-btn-okay");

    modalMessage.innerHTML = message;
    modalIcon.classList.add(`text-${type}`);
    if (type === 'success') {
        modalIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="60" fill="currentColor" class="bi bi-check2-s" viewBox="0 0 16 16">
        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"></path>
        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"></path>
      </svg>`;
        
    }
    else if (type === 'danger') { 
        modalIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="60" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
      </svg>`;
    }
    else if (type === 'info') { 
        modalIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="60" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
      </svg>`;
    }
    modal.style.display = "block";
    modal.classList.remove('d-none');

    modalBtnOk.addEventListener('click', function () {
        modal.style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}