// Helper: Set a cookie with expiration in days
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Helper: Get the cookie by name
function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

document.addEventListener('DOMContentLoaded', function () {
  // Read saved theme from cookie (expected values: "dark", "light", "auto")
  let theme = getCookie("theme");
  if (theme === "dark" || theme === "light") {
    document.documentElement.setAttribute("data-bs-theme", theme);
  } else {
    // For auto, follow system preferences
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute("data-bs-theme", prefersDark ? "dark" : "light");
    theme = "auto";
  }
  
  // Button references
  const darkBtn = document.querySelector("#darkModeBtn");
  const autoBtn = document.querySelector("#autoModeBtn");
  const lightBtn = document.querySelector("#lightModeBtn");

  // Reset active state on all theme buttons
  [darkBtn, autoBtn, lightBtn].forEach(btn => {
      if(btn) { btn.classList.remove("active"); }
  });
  
  // Set active class for the button corresponding to the saved theme
  if (theme === "dark" && darkBtn) {
    darkBtn.classList.add("active");
  } else if (theme === "light" && lightBtn) {
    lightBtn.classList.add("active");
  } else if (theme === "auto" && autoBtn) {
    autoBtn.classList.add("active");
  }

  // Theme toggle event listeners
  if (darkBtn) {
    darkBtn.addEventListener("click", function () {
      document.documentElement.setAttribute("data-bs-theme", "dark");
      setCookie("theme", "dark", 7);
      // Update active classes
      darkBtn.classList.add("active");
      if(autoBtn) autoBtn.classList.remove("active");
      if(lightBtn) lightBtn.classList.remove("active");
    });
  }
  if (lightBtn) {
    lightBtn.addEventListener("click", function () {
      document.documentElement.setAttribute("data-bs-theme", "light");
      setCookie("theme", "light", 7);
      // Update active classes
      lightBtn.classList.add("active");
      if(autoBtn) autoBtn.classList.remove("active");
      if(darkBtn) darkBtn.classList.remove("active");
    });
  }
  if (autoBtn) {
    autoBtn.addEventListener("click", function () {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute("data-bs-theme", prefersDark ? "dark" : "light");
      setCookie("theme", "auto", 7);
      // Update active classes
      autoBtn.classList.add("active");
      if(darkBtn) darkBtn.classList.remove("active");
      if(lightBtn) lightBtn.classList.remove("active");
    });
  }
});


// focus addlistmodal input field
document.getElementById('addListModal').addEventListener('shown.bs.modal', function () {
  document.getElementById('listTitle').focus();
});

// focus updatelistmodal input field
document.getElementById('updateListModal').addEventListener('shown.bs.modal', function () {
  document.getElementById('updateListTitle').focus();
});

// focus addcardmodal input field
document.getElementById('addCardModal').addEventListener('shown.bs.modal', function () {
  document.getElementById('cardTitle').focus();
});

//fill addlistmodal hidden project_id with actual project_id
document.addEventListener('DOMContentLoaded', function() {
  // When the addListModal is about to be shown, update its hidden input
  const addListModalEl = document.getElementById('addListModal');
  addListModalEl.addEventListener('show.bs.modal', function(event) {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-project-id attribute
    const projectId = button.getAttribute('data-project-id');
    // Update the modal's hidden input value
    addListModalEl.querySelector('input[name="project_id"]').value = projectId;
    console.log("Modal opened for project id:", projectId);
  });
});

//fill addcardmodal hidden list_id with actual list_id (and card_id if exists)
document.addEventListener('DOMContentLoaded', function() {
  // When the addCardModal is about to be shown, update its hidden input
  const addCardModalEl = document.getElementById('addCardModal');
  addCardModalEl.addEventListener('show.bs.modal', function(event) {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-list-id attribute
    const listId = button.getAttribute('data-list-id');
    // Update the modal's hidden list-id input value
    addCardModalEl.querySelector('input[name="list_id"]').value = listId;
    // Update the modal's hidden card-id input value
    const cardId = button.getAttribute('data-card-id');
    if (cardId) {
      addCardModalEl.querySelector('input[name="card_id"]').value = cardId;
      console.log("Modal opened for card id:", cardId);
    }
    console.log("Modal opened for list id:", listId);
  });
});

//fill updatecardmodal hidden card_id with actual card_id and title and body with actual values
document.addEventListener('DOMContentLoaded', function() {
  // When the updateCardModal is about to be shown, update its hidden input
  const updateCardModalEl = document.getElementById('updateCardModal');
  updateCardModalEl.addEventListener('show.bs.modal', function(event) {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-card-id attribute
    const cardId = button.getAttribute('data-card-id');
    // Update the modal's hidden input value
    updateCardModalEl.querySelector('input[name="card_id"]').value = cardId;
    // Update the modal's title input value
    updateCardModalEl.querySelector('input[name="title"]').value = button.getAttribute('data-card-title');
    console.log("Modal opened for card id:", cardId);
  });
});

//fill updatelistmodal hidden list_id with actual list_id
document.addEventListener('DOMContentLoaded', function() {
  // When the updateListModal is about to be shown, update its hidden input
  const updateListModalEl = document.getElementById('updateListModal');
  updateListModalEl.addEventListener('show.bs.modal', function(event) {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-list-id attribute
    const listId = button.getAttribute('data-list-id');
    // Update the modal's hidden input value
    updateListModalEl.querySelector('input[name="list_id"]').value = listId;
    console.log("Modal opened for list id:", listId);
  });
});

//Collapse list
document.addEventListener('DOMContentLoaded', function() {
  const collapseElements = document.querySelectorAll('.collapse');
  collapseElements.forEach(elem => {
    
    elem.addEventListener('hide.bs.collapse', function() {
        // Extract the list id from the collapse element's id (e.g., "collapse5" -> "5")
        const listId = this.id.replace('collapse', '');
        // Send the expanded state (collapsed is false)
        fetch(`/list/${listId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'collapsed=True'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not OK");
            }
            return response.json();
        })
        .then(data => console.log("List collapsed:", data))
        .catch(error => console.error("Error updating collapsed status:", error));
    });
    
    elem.addEventListener('show.bs.collapse', function() {
        // Extract the list id from the collapse element's id
        const listId = this.id.replace('collapse', '');
        // Send the collapsed state (collapsed is true)
        fetch(`/list/${listId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'collapsed=False'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not OK");
            }
            return response.json();
        })
        .then(data => console.log("List expanded:", data))
        .catch(error => console.error("Error updating collapsed status:", error));
    });
  });
});


// Add new list
document.addEventListener('DOMContentLoaded', function() {
    // Get references to the input and form
    const inputElement = document.getElementById("listTitle");
    const form = document.getElementById("addListForm");
  
    // Detect text input changes
    inputElement.addEventListener('input', function(event) {
      console.log("Text entered:", event.target.value);
      // You can add additional logic here if needed
    });
  
    // Handle form submission
    form.addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent default form submission
  
      // Gather form data
      const formData = new FormData(form);
  
      // Send form data to your API endpoint
      fetch('/list', { // Replace with your actual API endpoint
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json(); // Adjust based on your API response format
      })
      .then(data => {
        console.log("Success:", data);
        // Hide the modal after a successful submission using Bootstrap's modal API
        const modalEl = document.getElementById('addListModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
          modalInstance.hide();
        } else {
          // If no instance exists, create one and then hide it
          new bootstrap.Modal(modalEl).hide();
        }
        location.reload(); // Reload the page to show the new list
      })
      .catch(error => {
        console.error("Error submitting form:", error);
        // Optionally, display an error message to the user
      });
    });
  });


  // Archive list
  function archiveList(listId)
  {
    fetch(`/list/${listId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `archived=True`
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not OK");
        }
        return response.json();
    })
    .then(data => {
        console.log("Success:", data);
        location.reload();
    })
    .catch(error => {
        console.error("Error submitting form:", error);
    });
  }


// Add new card
document.addEventListener('DOMContentLoaded', function() {
  const addCardForm = document.getElementById('addCardForm');

  addCardForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Gather form data
    const formData = new FormData(addCardForm);
    // Append the card description from Quill's editor content
    const cardDescription = quill.root.innerHTML;
    if (cardDescription !== '<p><br></p>') {
      // If the description is not empty, append body to the form data
      formData.append('body', cardDescription);
    }
    

    // Send form data to your API endpoint for adding a new card
    fetch('/card', { // Adjust the endpoint as needed
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.json();
    })
    .then(data => {
      console.log("Card added successfully:", data);
      // Hide the modal after a successful submission
      const modalEl = document.getElementById('addCardModal');
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      } else {
        // If no instance exists, create one and then hide it
        new bootstrap.Modal(modalEl).hide();
      }
      location.reload(); // Reload the page to update the card list
    })
    .catch(error => {
      console.error("Error submitting card form:", error);
      // Optionally, display an error message to the user
    });
  });
});


// Update Card Options
document.addEventListener('DOMContentLoaded', function() {
  const cardActionItems = document.querySelectorAll('.dropdown-item.card-action');

  cardActionItems.forEach(item => {
    item.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default anchor behavior

      // Retrieve card id and action from the clicked element
      const cardId = this.getAttribute('data-card-id');
      const action = this.getAttribute('data-action');
      console.log("card ID:", cardId, "Action:", action);

      // Send data to the Flask endpoint using fetch API
      fetch(`/card/${cardId}`, { // Adjust the endpoint as needed
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `action=${encodeURIComponent(action)}`
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json();
      })
      .then(data => {
        console.log("card updated:", data);
        // Optionally, update the UI or force a page reload:
        location.reload();
      })
      .catch(error => {
        console.error("Error updating card:", error);
      });
    });
  });
});

// Update Card Title/Body
document.addEventListener('DOMContentLoaded', function() {
  const updateCardForm = document.getElementById('updateCardForm');

  updateCardForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const cardId = updateCardForm.querySelector('input[name="card_id"]').value;
    // Gather form data
    const formData = new FormData(updateCardForm);
    // Append the card description from Quill's editor content
    const cardDescription = updateQuill.root.innerHTML;
    if (cardDescription !== '<p><br></p>') {
      // If the description is not empty, append body to the form data
      formData.append('body', cardDescription);
    }
    else{
      formData.append('body', '');
    }

    // Send form data to your API endpoint for updating a card
    fetch(`/card/${cardId}`, {
      method: 'PUT',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.json();
    })
    .then(data => {
      console.log("Card updated successfully:", data);
      // Hide the modal after a successful submission
      const modalEl = document.getElementById('updateCardModal');
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      } else {
        // If no instance exists, create one and then hide it
        new bootstrap.Modal(modalEl).hide();
      }
      location.reload(); // Reload the page to update the card list
    })
    .catch(error => {
      console.error("Error submitting card form:", error);
      // Optionally, display an error message to the user
    });
  });
});

// Update List Title
document.addEventListener('DOMContentLoaded', function() {
  const updateListForm = document.getElementById('updateListForm');

  updateListForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const listId = updateListForm.querySelector('input[name="list_id"]').value;
    // Gather form data
    const formData = new FormData(updateListForm);

    // Send form data to your API endpoint for updating a list
    fetch(`/list/${listId}`, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.json();
    })
    .then(data => {
      console.log("List updated successfully:", data);
      // Hide the modal after a successful submission
      const modalEl = document.getElementById('updateListModal');
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      } else {
        // If no instance exists, create one and then hide it
        new bootstrap.Modal(modalEl).hide();
      }
      location.reload(); // Reload the page to update the card list
    })
    .catch(error => {
      console.error("Error submitting list form:", error);
      // Optionally, display an error message to the user
    });
  });
});


// Quill Text Editor

let quill;
let updateQuill;

document.addEventListener('DOMContentLoaded', function() {
  quill = new Quill('#editor', {
    theme: 'bubble',
    placeholder: 'Add Card Description'
  });
});

document.addEventListener('DOMContentLoaded', function() {
  updateQuill = new Quill('#updateEditor', {
    theme: 'bubble',
    placeholder: 'Add Card Description'
  });

  // When updateCardModal is shown, prefill the editor.
  const updateModalEl = document.getElementById('updateCardModal');
  updateModalEl.addEventListener('show.bs.modal', function(event) {
    // The button that triggered the modal
    const button = event.relatedTarget;
    const cardBody = button.getAttribute('data-card-body') || '';
    // Use Quill's clipboard API to insert HTML content
    if (cardBody !== 'None'){
      updateQuill.clipboard.dangerouslyPasteHTML(cardBody);
    }
    else{
      updateQuill.clipboard.dangerouslyPasteHTML('');
    }
    updateQuill.focus();
  });
});