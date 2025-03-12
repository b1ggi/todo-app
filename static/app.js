let quill;
let updateQuill;

window.addEventListener("load", function() {
  document.body.classList.add("visible");
});


// Helper: Set a cookie with expiration in days
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Helper: Get the cookie by name
function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//DOMCONTENTCLOADED
document.addEventListener("DOMContentLoaded", function () {

  // THEME TOGGLE
  // Read saved theme from cookie (expected values: "dark", "light", "auto")
  let theme = getCookie("theme");
  if (theme === "dark" || theme === "light") {
    document.documentElement.setAttribute("data-bs-theme", theme);
  } else {
    // For auto, follow system preferences
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute(
      "data-bs-theme",
      prefersDark ? "dark" : "light"
    );
    theme = "auto";
  }

  // Button references
  const darkBtn = document.querySelector("#darkModeBtn");
  const autoBtn = document.querySelector("#autoModeBtn");
  const lightBtn = document.querySelector("#lightModeBtn");

  // Reset active state on all theme buttons
  [darkBtn, autoBtn, lightBtn].forEach((btn) => {
    if (btn) {
      btn.classList.remove("active");
    }
  });

  // Set active class for the button corresponding to the saved theme
  if (theme === "dark" && darkBtn) {
    darkBtn.classList.add("active");
  } else if (theme === "light" && lightBtn) {
    lightBtn.classList.add("active");
  } else if (theme === "auto" && autoBtn) {
    autoBtn.classList.add("active");
  }

// Funktion zur Aktualisierung des iOS Statusleisten-Stils
function updateStatusBarStyle(theme) {
  let metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (!metaStatusBar) {
    metaStatusBar = document.createElement("meta");
    metaStatusBar.setAttribute("name", "apple-mobile-web-app-status-bar-style");
    document.head.appendChild(metaStatusBar);
  }
  // Für Dark Mode wird "black-translucent" genutzt, ansonsten "default"
  metaStatusBar.setAttribute("content", theme === "dark" ? "black-translucent" : "default");
}

// Bestimme das finale Theme (auch für "auto" anhand der Systempräferenz)
let finalTheme = theme;
if (theme === "auto") {
  finalTheme = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
updateStatusBarStyle(finalTheme);



  // Theme toggle event listeners
  if (darkBtn) {
    darkBtn.addEventListener("click", function () {
      document.documentElement.setAttribute("data-bs-theme", "dark");
      setCookie("theme", "dark", 365);
      // Update active classes
      darkBtn.classList.add("active");
      if (autoBtn) autoBtn.classList.remove("active");
      if (lightBtn) lightBtn.classList.remove("active");
    });
  }
  if (lightBtn) {
    lightBtn.addEventListener("click", function () {
      document.documentElement.setAttribute("data-bs-theme", "light");
      setCookie("theme", "light", 365);
      // Update active classes
      lightBtn.classList.add("active");
      if (autoBtn) autoBtn.classList.remove("active");
      if (darkBtn) darkBtn.classList.remove("active");
    });
  }
  if (autoBtn) {
    autoBtn.addEventListener("click", function () {
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute(
        "data-bs-theme",
        prefersDark ? "dark" : "light"
      );
      setCookie("theme", "auto", 365);
      // Update active classes
      autoBtn.classList.add("active");
      if (darkBtn) darkBtn.classList.remove("active");
      if (lightBtn) lightBtn.classList.remove("active");
    });
  }

  //PREFERRED THEME COLOR UPDATE
  function updateThemeColor(color) {
    let metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute("content", color);
  }

  // Beispiel: Überprüfen des bevorzugten Farbschemas
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    updateThemeColor("#000000");
  } else {
    updateThemeColor("#ffffff");
  }

  // MOBILE COLUMN SETTING
  const col6Btn = document.querySelector("#col6Btn");
  const col12Btn = document.querySelector("#col12Btn");
  // Use a class selector since there may be multiple elements that require the column class
  const columnSettingEls = document.querySelectorAll(".column-setting");

  // Read the saved mobile column setting, default to "col-6" if cookie value is not "col-6" or "col-12"
  let mobileColumn = getCookie("mobileColumn");
  if (mobileColumn !== "col-6" && mobileColumn !== "col-12") {
    mobileColumn = "col-6"; // default case
    setCookie("mobileColumn", mobileColumn, 365);
  }

  // Apply the saved column class to all elements
  columnSettingEls.forEach((el) => {
    el.classList.remove("col-6", "col-12");
    el.classList.add(mobileColumn);
  });

  // Initialize active state for the buttons based on the saved column setting
  if (mobileColumn === "col-6") {
    if (col6Btn) col6Btn.classList.add("active");
    if (col12Btn) col12Btn.classList.remove("active");
  } else if (mobileColumn === "col-12") {
    if (col12Btn) col12Btn.classList.add("active");
    if (col6Btn) col6Btn.classList.remove("active");
  }

  // Set up event listeners for the mobile column toggle buttons

  if (col6Btn) {
    col6Btn.addEventListener("click", function (e) {
      console.log("col6Btn clicked", e.currentTarget);
      // Update each column element to use "col-6"
      columnSettingEls.forEach((el) => {
        el.classList.remove("col-12");
        el.classList.add("col-6");
      });
      setCookie("mobileColumn", "col-6", 365);
      // Update active button states
      col6Btn.classList.add("active");
      if (col12Btn) col12Btn.classList.remove("active");
      setTimeout(() => console.log("col6Btn classes:", col6Btn.className), 100);
    });
  }

  if (col12Btn) {
    col12Btn.addEventListener("click", function (e) {
      console.log("col12Btn clicked", e.currentTarget);
      // Update each column element to use "col-12"
      columnSettingEls.forEach((el) => {
        el.classList.remove("col-6");
        el.classList.add("col-12");
      });
      setCookie("mobileColumn", "col-12", 365);
      // Update active button states
      col12Btn.classList.add("active");
      if (col6Btn) col6Btn.classList.remove("active");
      setTimeout(
        () => console.log("col12Btn classes:", col12Btn.className),
        100
      );
    });
  }

  // FILL ADDLISTMODAL HIDDEN PROJECT_ID WITH ACTUAL PROJECT_ID
  // When the addListModal is about to be shown, update its hidden input
  const addListModalEl = document.getElementById("addListModal");
  addListModalEl.addEventListener("show.bs.modal", function (event) {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-project-id attribute
    const projectId = button.getAttribute("data-project-id");
    // Update the modal's hidden input value
    addListModalEl.querySelector('input[name="project_id"]').value = projectId;
    console.log("Modal opened for project id:", projectId);
  });

  // FILL ADDCARDMODAL HIDDEN LIST_ID WITH ACTUAL LIST_ID (AND CARD_ID IF EXISTS)
  // When the addCardModal is about to be shown, update its hidden input
  const addCardModalEl = document.getElementById("addCardModal");
  addCardModalEl.addEventListener("show.bs.modal", function (event) {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-list-id attribute
    const listId = button.getAttribute("data-list-id");
    // Update the modal's hidden list-id input value
    addCardModalEl.querySelector('input[name="list_id"]').value = listId;
    // Update the modal's hidden card-id input value
    const cardId = button.getAttribute("data-card-id");
    if (cardId) {
      addCardModalEl.querySelector('input[name="card_id"]').value = cardId;
      console.log("Modal opened for card id:", cardId);
    }
    console.log("Modal opened for list id:", listId);
  });

  // FILL UPDATECARDMODAL HIDDEN CARD_ID WITH ACTUAL CARD_ID AND TITLE AND BODY WITH ACTUAL VALUES
  // When the updateCardModal is about to be shown, update its hidden input
  const updateCardModalEl = document.getElementById("updateCardModal");
  updateCardModalEl.addEventListener("show.bs.modal", function (event) {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-card-id attribute
    const cardId = button.getAttribute("data-card-id");
    // Update the modal's hidden input value
    updateCardModalEl.querySelector('input[name="card_id"]').value = cardId;
    // Update the modal's title input value
    updateCardModalEl.querySelector('input[name="title"]').value =
      button.getAttribute("data-card-title");
    console.log("Modal opened for card id:", cardId);
  });

  //FILL UPDATELISTMODAL HIDDEN LIST_ID WITH ACTUAL LIST_ID
  // When the updateListModal is about to be shown, update its hidden input
  const updateListModalEl = document.getElementById("updateListModal");
  updateListModalEl.addEventListener("show.bs.modal", function (event) {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-list-id attribute
    const listId = button.getAttribute("data-list-id");
    // Update the modal's hidden input value
    updateListModalEl.querySelector('input[name="list_id"]').value = listId;
    console.log("Modal opened for list id:", listId);
  });

  // COLLAPSE LIST
  const collapseElements = document.querySelectorAll(".collapse");
  collapseElements.forEach((elem) => {
    elem.addEventListener("hide.bs.collapse", function () {
      // Extract the list id from the collapse element's id (e.g., "collapse5" -> "5")
      const listId = this.id.replace("collapse", "");
      // Send the expanded state (collapsed is false)
      fetch(`/list/${listId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "collapsed=True",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not OK");
          }
          return response.json();
        })
        .then((data) => console.log("List collapsed:", data))
        .catch((error) =>
          console.error("Error updating collapsed status:", error)
        );
    });

    elem.addEventListener("show.bs.collapse", function () {
      // Extract the list id from the collapse element's id
      const listId = this.id.replace("collapse", "");
      // Send the collapsed state (collapsed is true)
      fetch(`/list/${listId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "collapsed=False",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not OK");
          }
          return response.json();
        })
        .then((data) => console.log("List expanded:", data))
        .catch((error) =>
          console.error("Error updating collapsed status:", error)
        );
    });
  });

    // COLLAPSE ELEMENTS NUMBER BADGE UND IOS FIX
    // Select all collapse elements (adjust the selector as needed) 
    const collapseButtons = document.querySelectorAll('button[data-bs-toggle="collapse"]');
    collapseButtons.forEach(function(btn) {
      function blurAndToggle() {
        btn.blur(); // remove focus
        setTimeout(function(){
          const num = btn.querySelector('.collapsed-number');
          if (btn.getAttribute("aria-expanded") === "false") {
            if(num) num.classList.add("visible");
          } else {
            if(num) num.classList.remove("visible");
          }
        }, 350); // adjust based on your collapse animation
      }
    
      btn.addEventListener("click", blurAndToggle);
      btn.addEventListener("touchend", blurAndToggle);
    });


    

  // ADD NEW LIST
  // Get references to the input and form
  const inputElement = document.getElementById("listTitle");
  const form = document.getElementById("addListForm");

  // Detect text input changes
  inputElement.addEventListener("input", function (event) {
    console.log("Text entered:", event.target.value);
    // You can add additional logic here if needed
  });

  // Handle form submission
  form.addEventListener("submit", function (event) {
    if (inputElement.value.trim() === "") {
    event.preventDefault(); // Prevent default form submission
    new bootstrap.Tooltip(inputElement, {title: "Meeeeep.", placement: "bottom"}).show();
    return;
    }

    // Gather form data
    const formData = new FormData(form);

    // Send form data to your API endpoint
    fetch("/list", {
      // Replace with your actual API endpoint
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json(); // Adjust based on your API response format
      })
      .then((data) => {
        console.log("Success:", data);
        // Hide the modal after a successful submission using Bootstrap's modal API
        const modalEl = document.getElementById("addListModal");
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
          modalInstance.hide();
        } else {
          // If no instance exists, create one and then hide it
          new bootstrap.Modal(modalEl).hide();
        }
        location.reload(); // Reload the page to show the new list
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        // Optionally, display an error message to the user
      });
  });

  // ADD NEW CARD
  const addCardForm = document.getElementById("addCardForm");

  addCardForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

  // check empty, Get and trim the card title value
  const cardTitleInput = document.getElementById("cardTitle");
  const cardTitle = cardTitleInput.value.trim();

  // Check if the input is empty
  if (cardTitle === "") {
    new bootstrap.Tooltip(cardTitleInput, {title: "Möööp.", placement: "bottom"}).show();
    // alert("mööp.");
    return; // Stop further execution
  }

    // Gather form data
    const formData = new FormData(addCardForm);
    // Append the card description from Quill's editor content
    const cardDescription = quill.root.innerHTML;
    if (cardDescription !== "<p><br></p>") {
      // If the description is not empty, append body to the form data
      formData.append("body", cardDescription);
    }

    // Send form data to your API endpoint for adding a new card
    fetch("/card", {
      // Adjust the endpoint as needed
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Card added successfully:", data);
        // Hide the modal after a successful submission
        const modalEl = document.getElementById("addCardModal");
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
          modalInstance.hide();
        } else {
          // If no instance exists, create one and then hide it
          new bootstrap.Modal(modalEl).hide();
        }
        location.reload(); // Reload the page to update the card list
      })
      .catch((error) => {
        console.error("Error submitting card form:", error);
        // Optionally, display an error message to the user
      });
  });

  // UPDATE CARD OPTIONS
  const cardActionItems = document.querySelectorAll(
    ".dropdown-item.card-action"
  );

  cardActionItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default anchor behavior

      // Retrieve card id and action from the clicked element
      const cardId = this.getAttribute("data-card-id");
      const action = this.getAttribute("data-action");
      console.log("card ID:", cardId, "Action:", action);

      // Send data to the Flask endpoint using fetch API
      fetch(`/card/${cardId}`, {
        // Adjust the endpoint as needed
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `action=${encodeURIComponent(action)}`,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not OK");
          }
          return response.json();
        })
        .then((data) => {
          console.log("card updated:", data);
          // Optionally, update the UI or force a page reload:
          location.reload();
        })
        .catch((error) => {
          console.error("Error updating card:", error);
        });
    });
  });

  // UPDATE CARD TITLE/BODY
  const updateCardForm = document.getElementById("updateCardForm");

  updateCardForm.addEventListener("submit", function (event) {

    event.preventDefault(); // Prevent default form submission
    const cardId = updateCardForm.querySelector('input[name="card_id"]').value;
    const cardTitle = updateCardForm.querySelector('input[name="title"]').value;

    // Check if the input is empty
    if (cardTitle.trim() === "") {
      new bootstrap.Tooltip(updateCardForm.querySelector('input[name="title"]'), {title: "Nein.", placement: "bottom"}).show();
      // alert("mööp.");
      return; // Stop further execution
    }

    // Gather form data
    const formData = new FormData(updateCardForm);
    // Append the card description from Quill's editor content
    const cardDescription = updateQuill.root.innerHTML;
    if (cardDescription !== "<p><br></p>") {
      // If the description is not empty, append body to the form data
      formData.append("body", cardDescription);
    } else {
      formData.append("body", "");
    }

    // Send form data to your API endpoint for updating a card
    fetch(`/card/${cardId}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Card updated successfully:", data);
        // Hide the modal after a successful submission
        const modalEl = document.getElementById("updateCardModal");
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
          modalInstance.hide();
        } else {
          // If no instance exists, create one and then hide it
          new bootstrap.Modal(modalEl).hide();
        }
        location.reload(); // Reload the page to update the card list
      })
      .catch((error) => {
        console.error("Error submitting card form:", error);
        // Optionally, display an error message to the user
      });
  });

  // UPDATE LIST TITLE
  const updateListForm = document.getElementById("updateListForm");

  updateListForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    const listId = updateListForm.querySelector('input[name="list_id"]').value;
    const listTitle = updateListForm.querySelector('input[name="title"]').value;
    // Check if the input is empty
    if (listTitle.trim() === "") {
      new bootstrap.Tooltip(updateListForm.querySelector('input[name="title"]'), {title: "...nein", placement: "bottom"}).show();
      // alert("mööp.");
      return; // Stop further execution
    }
    // Gather form data
    const formData = new FormData(updateListForm);

    // Send form data to your API endpoint for updating a list
    fetch(`/list/${listId}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json();
      })
      .then((data) => {
        console.log("List updated successfully:", data);
        // Hide the modal after a successful submission
        const modalEl = document.getElementById("updateListModal");
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
          modalInstance.hide();
        } else {
          // If no instance exists, create one and then hide it
          new bootstrap.Modal(modalEl).hide();
        }
        location.reload(); // Reload the page to update the card list
      })
      .catch((error) => {
        console.error("Error submitting list form:", error);
        // Optionally, display an error message to the user
      });
  });

  // QUILL TEXT EDITOR ADD CARD
  quill = new Quill("#editor", {
    theme: "bubble",
    placeholder: "Add Card Description",
  });

  //QUILL TEXT EDITOR UPDATE CARD
  updateQuill = new Quill("#updateEditor", {
    theme: "bubble",
    placeholder: "Add Card Description",
  });

  // When updateCardModal is shown, prefill the editor.
  const updateModalEl = document.getElementById("updateCardModal");
  updateModalEl.addEventListener("show.bs.modal", function (event) {
    // The button that triggered the modal
    const button = event.relatedTarget;
    const cardBody = button.getAttribute("data-card-body") || "";
    // Use Quill's clipboard API to insert HTML content
    if (cardBody !== "None") {
      updateQuill.clipboard.dangerouslyPasteHTML(cardBody);
    } else {
      updateQuill.clipboard.dangerouslyPasteHTML("");
    }
    updateQuill.focus();
  });
// PREVENT PINCH ZOOM ON IOS
  document.addEventListener('touchmove', function(event) {
    if (event.scale && event.scale !== 1) {
      event.preventDefault();
    }
  }, { passive: false });

// FOCUS MODAL INPUT FIELDS
document
  .getElementById("addListModal")
  .addEventListener("shown.bs.modal", function () {
    document.getElementById("listTitle").focus();
  });


document
  .getElementById("updateListModal")
  .addEventListener("shown.bs.modal", function () {
    document.getElementById("updateListTitle").focus();
  });


document
  .getElementById("addCardModal")
  .addEventListener("shown.bs.modal", function () {
    document.getElementById("cardTitle").focus();
  });

// NAVBAR FADE
const navbar = document.getElementById("mainNav");
  let lastScrollTop = 0;
  let ticking = false;
  let isBouncingAtEdge = false;
  
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = Math.max(
          document.body.scrollHeight, 
          document.documentElement.scrollHeight,
          document.body.offsetHeight, 
          document.documentElement.offsetHeight
        );
        const windowHeight = window.innerHeight;
        
        // Detect if we're in a bounce state at top or bottom
        const isAtTop = currentScrollTop <= 0;
        const isAtBottom = currentScrollTop + windowHeight >= documentHeight;
        
        // Only update navbar if we're not in a bounce state
        if (!(isAtTop && lastScrollTop < 0) && !(isAtBottom && lastScrollTop > currentScrollTop)) {
          // Normal scrolling behavior (not bouncing)
          isBouncingAtEdge = false;
          
          // Scrolling down and not at the top
          if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
            navbar.classList.add("navbar-scrolled");
            navbar.classList.remove("navbar-visible");
          } 
          // Scrolling up or at the top
          else {
            navbar.classList.remove("navbar-scrolled");
            navbar.classList.add("navbar-visible");
          }
        } else {
          // We're in a bounce state, don't change navbar visibility
          isBouncingAtEdge = true;
        }
        
        lastScrollTop = currentScrollTop;
        ticking = false;
      });
      
      ticking = true;
    }
  }
  
  // Handle both standard and iOS-specific events
  window.addEventListener("scroll", onScroll, { passive: true });
  
  // Handle touchend to restore proper navbar state after bounce
  document.addEventListener("touchend", function() {
    if (isBouncingAtEdge) {
      // Short delay to let bounce effect settle
      setTimeout(function() {
        onScroll();
      }, 300);
    }
  }, { passive: true });
  
  // Initial state
  navbar.classList.add("navbar-visible");



});

//END OF DOMCONTENTCLOADED

// Archive list
function archiveList(listId) {
  fetch(`/list/${listId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `archived=True`,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      location.reload();
    })
    .catch((error) => {
      console.error("Error submitting form:", error);
    });
}


