// focus addlistmodal input field
document.getElementById('addListModal').addEventListener('shown.bs.modal', function () {
  document.getElementById('listTitle').focus();
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

//fill addcardmodal hidden list_id with actual list_id
document.addEventListener('DOMContentLoaded', function() {
  // When the addCardModal is about to be shown, update its hidden input
  const addCardModalEl = document.getElementById('addCardModal');
  addCardModalEl.addEventListener('show.bs.modal', function(event) {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-list-id attribute
    const listId = button.getAttribute('data-list-id');
    // Update the modal's hidden input value
    addCardModalEl.querySelector('input[name="list_id"]').value = listId;
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



// Update Card
document.addEventListener('DOMContentLoaded', function() {
  const taskActionItems = document.querySelectorAll('.dropdown-item.task-action');

  taskActionItems.forEach(item => {
    item.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default anchor behavior

      // Retrieve task id and action from the clicked element
      const taskId = this.getAttribute('data-task-id');
      const action = this.getAttribute('data-action');
      console.log("Task ID:", taskId, "Action:", action);

      // Send data to the Flask endpoint using fetch API
      fetch(`/card/${taskId}`, { // Adjust the endpoint as needed
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
        console.log("Task updated:", data);
        // Optionally, update the UI or force a page reload:
        location.reload();
      })
      .catch(error => {
        console.error("Error updating task:", error);
      });
    });
  });
});




// Quill Text Editor
const quill = new Quill('#editor', {
    theme: 'bubble',
    placeholder: 'Add Card Description'
  });
