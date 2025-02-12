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