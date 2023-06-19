const addModalElementToDom = () =>  {
  // Check if the element with id 'modal-window' already exists
  let existingElement = document.getElementById('modal-window');

  // If the element doesn't exist, add it
  if (!existingElement) {
    // Create a new div element
    let newElement = document.createElement('div');

    // Set the HTML content
    newElement.innerHTML = `
      <div id="modal-window" class="modal d-none">
        <div class="modal-content">
          <span id="modal-icon"></span>
          <p id="modal-message" class="mt-2"></p>
          <div style="display: flex; flex-direction: row; gap: 10px; align-items: center; justify-content: center;">
            <button id="modal-btn-okay" type="submit" class="btn btn-default mt-4 px-4">OK</button>
            <button id="modal-btn-cancel" type="submit" class="btn btn-default mt-4 px-4 d-none">Cancel</button>
          </div>          
        </div>
      </div>
    `;

    // Find the body element in the DOM
    let bodyElement = document.body;

    // Append the new element to the body
    bodyElement.appendChild(newElement);
  }
}

// Call the function to add the element to the DOM
addModalElementToDom();

const showMessage = (type = "success", message = "", callback = null) => {
    const modal = document.getElementById("modal-window");
    const modalIcon = document.getElementById("modal-icon");
    const modalMessage = document.getElementById("modal-message");
    const modalBtnOk = document.getElementById("modal-btn-okay");
    const modalBtnCancel = document.getElementById("modal-btn-cancel");

    modalMessage.innerHTML = message;
    modalIcon.className = '';
    modalIcon.classList.add(`text-${type}`);
    modalBtnOk.innerHTML = 'Ok';    
    modalBtnOk.classList.add('btn-default');
    modalBtnOk.classList.remove('btn-secondary');
    if (modalBtnCancel) { 
      modalBtnCancel.classList.add('d-none');
    }
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
    else if (type === 'confirm') { 
        modalIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="60" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
      </svg>`;
      modalBtnCancel.classList.remove('d-none');
      modalBtnCancel.innerHTML = 'No';
      modalBtnOk.classList.add('btn-secondary');
      modalBtnOk.innerHTML = 'Yes';
    }
    modal.style.display = "block";
    modal.classList.remove('d-none');

    modalBtnOk.addEventListener('click', function () {
      modal.style.display = "none";
      if (callback instanceof Function) {
        callback();
      }
      else { 
        modal.style.display = "none";
      }
    });

    if (type === 'confirm') {
      modalBtnCancel.addEventListener('click', function () {
        modal.style.display = "none";        
      });
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}