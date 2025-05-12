// Get data for storage.js
import { getUserIds, getData, addWishlistItem, deleteWishlistItem } from "./storage.js"; // <<< Make sure deleteWishlistItem is imported from your updated storage.js

// Wait for the HTML to be loaded to start JS
window.onload = function () { // <<< START of window.onload
   console.log("main.js loaded and window is ready.");

   // --- Element References ---
   const familyMemberSelect = document.getElementById("family-member-select");//dropdonw menu
   const wishlistDisplayArea = document.getElementById("wishlist-display");
   const selectedPersonNameSpan = document.getElementById("selected-person-name");

   // Form elements for adding a new present
   const addPresentForm = document.getElementById('add-present-form');// form
   const presentNameInput = document.getElementById('present-name');
   const descriptionInput = document.getElementById('present-description');
   const linkInput = document.getElementById('present-url');

   // --- Function to display wishlist items ---
   function displayWishlistForUser(userId) {
      if (!wishlistDisplayArea) { // ! = is it wasn't fund 
         console.error("Could not find the #wishlist-display element! Cannot display items.");
         return;
      }
      wishlistDisplayArea.innerHTML = ''; // Clear content

      if (!selectedPersonNameSpan) {
         console.error("Could not find the #selected-person-name element! Cannot update title.");
      } else {
         if (userId) {
            selectedPersonNameSpan.textContent = `${userId}'s Wishlist`;
         } else {
            selectedPersonNameSpan.textContent = 'Wishlist';
         }
      }

      if (!userId) {
         console.log("No specific user selected. Display area will remain empty.");
         return; // Exit if no user is selected
      }
         // midle of DisplayWhishListforUser function
      console.log(`Attempting to fetch and display data for user: ${userId}`);

      const userWishlistItems = getData(userId);

      console.log("Data received from getData():", userWishlistItems);

      if (userWishlistItems && userWishlistItems.length > 0) {
         console.log(`Found ${userWishlistItems.length} items to display.`);

         userWishlistItems.forEach((wishlistItem, index) => {// call back function that forEach runs for every item.
            console.log("Currently displaying item in displayWishlistForUser:", wishlistItem);

            const itemElement = document.createElement("div");
            // itemElement.classList.add("present-name");
            itemElement.classList.add("wishlist-item");

            if (typeof wishlistItem === 'object' && wishlistItem !== null) {
               if (wishlistItem.itemName) {
                  const nameElement = document.createElement("h4");
                  nameElement.textContent = wishlistItem.itemName;
                  nameElement.style.margin = "0 0 5px 0";
                  itemElement.appendChild(nameElement);
               } else {
                  const nameElement = document.createElement("h4");
                  nameElement.textContent = "Unnamed Item";
                  nameElement.style.margin = "0 0 5px 0";
                  itemElement.appendChild(nameElement);
               }

               if (wishlistItem.description) {
                  const descriptionElement = document.createElement("p");
                  descriptionElement.textContent = wishlistItem.description;
                  descriptionElement.style.fontSize = "0.9em";
                  descriptionElement.style.color = "#333";
                  descriptionElement.style.marginBottom = "5px";
                  itemElement.appendChild(descriptionElement);
               }

               if (wishlistItem.link && wishlistItem.link.trim() !== "") { // Added check for non-empty link
                  const linkElement = document.createElement("a");
                  let properLink = wishlistItem.link.trim();
                  if (properLink && !properLink.startsWith('http://') && !properLink.startsWith('https://')) {
                     properLink = 'http://' + properLink;
                  }
                  linkElement.href = properLink;
                  linkElement.textContent = "View Item";
                  linkElement.target = "_blank";
                  linkElement.rel = "noopener noreferrer";
                  linkElement.style.display = "inline-block";
                  linkElement.style.marginRight = "10px"; // Added margin for spacing before delete button
                  itemElement.appendChild(linkElement);
               }
            } else if (typeof wishlistItem === 'string') {
               itemElement.textContent = wishlistItem;
            } else {
               itemElement.textContent = "Invalid item data.";
               console.warn("Encountered an item with an unexpected format:", wishlistItem);
            }

            itemElement.style.border = "1px solid #ddd";
            itemElement.style.padding = "10px 15px";
            itemElement.style.marginBottom = "10px";
            itemElement.style.borderRadius = "5px";
            itemElement.style.backgroundColor = "#f9f9f9";
            // For basic side-by-side layout of content and button if not using full CSS flexbox yet:
            itemElement.style.display = "flex";
            itemElement.style.justifyContent = "space-between";
            itemElement.style.alignItems = "flex-start"; // Or "center" if you prefer vertical centering


            // --- Create and add the Delete Button ---
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-item-btn"); //  styling & event listiner
            deleteButton.setAttribute("data-item-index", index); // <<< Store the item's index!


            //  styling for the button
            deleteButton.style.marginLeft = "10px"; // This might be redundant with flex justify-content: space-between
            deleteButton.style.padding = "2px 8px";
            deleteButton.style.backgroundColor = "#ffdddd";
            deleteButton.style.border = "1px solid #ffaaaa";
            deleteButton.style.borderRadius = "3px";
            deleteButton.style.cursor = "pointer";
            deleteButton.style.flexShrink = "0"; // Prevent button from shrinking

    
            // --- ADD EVENT LISTENER TO THE DELETE BUTTON ---
            deleteButton.addEventListener('click', function () {
               const itemIndexToDelete = parseInt(this.getAttribute('data-item-index'));
               const itemNameForConfirm = (typeof wishlistItem === 'object' && wishlistItem.itemName) ? wishlistItem.itemName : 'this item';

               const confirmDelete = confirm(`Are you sure you want to delete "${itemNameForConfirm}"?`);
               if (confirmDelete) {
                  const success = deleteWishlistItem(userId, itemIndexToDelete); // Call imported function
                  if (success) {
                     console.log("Item deleted successfully from storage.");
                     displayWishlistForUser(userId); // Refresh the list
                  } else {
                     console.error("Failed to delete item from storage.");
                     alert("Could not delete the wishlist item. Please check the console for errors.");
                  }
               } else {
                  console.log("Deletion cancelled by user.");
               }
            });
            // --- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ---

            itemElement.appendChild(deleteButton);

            if (wishlistDisplayArea) {
               wishlistDisplayArea.appendChild(itemElement);
            } else {
               console.error("Wishlist display area became unavailable while adding items.");
            }


         }); // End of forEach loop

      } else if (userWishlistItems && userWishlistItems.length === 0) { // This belongs to the if (userWishlistItems && userWishlistItems.length > 0)
         console.log("This user has no wishlist items yet.");
         const noItemsMessage = document.createElement("p");
         noItemsMessage.textContent = "This person hasn't added any wishes yet!";
         noItemsMessage.style.fontStyle = "italic";
         wishlistDisplayArea.appendChild(noItemsMessage);
      } else { // This also belongs to the if (userWishlistItems && userWishlistItems.length > 0)
         console.log("No wishlist data available for this user or an error occurred.");
         // Only show error message if a specific user was selected (not initial "Select a Person")
         if (userId) {
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "Could not load wishlist items at this time or the list is empty.";
            wishlistDisplayArea.appendChild(errorMessage);
         }
      }
      
   } // End of displayWishlistForUser function

   // --- Populate Dropdown Menu ---
   if (familyMemberSelect) {
      console.log("Found the dropdown element");
      try {
         const familyMemberIds = getUserIds();
         console.log("Populating dropdown with IDs:", familyMemberIds);

         //  add the real users:
         familyMemberIds.forEach((memberId) => {
            if (memberId) { // Only add if memberId is not an empty string
               const optionElement = document.createElement("option");
               optionElement.value = memberId;
               optionElement.textContent = memberId;
               familyMemberSelect.appendChild(optionElement);
            }
         });
         console.log("Dropdown populated.");

         // For safety, ensure `familyMemberSelect.value = "";` is set if the default is present.
         if (familyMemberSelect.options.length > 0 && familyMemberSelect.options[0].value === "") {
            familyMemberSelect.value = ""; // Ensure default is selected if present
         }

         // --- Event Listener for Dropdown Change ---
         familyMemberSelect.addEventListener('change', function () {
            console.log("Dropdown selection changed!");
            const selectedUserId = this.value;
            console.log(`User selected ID: ${selectedUserId}`);
            displayWishlistForUser(selectedUserId);
         });

         // --- Event Listener for Adding a New Present ---
         if (addPresentForm) {
            addPresentForm.addEventListener('submit', function (event) {
               event.preventDefault();
               console.log("Add present form submitted!");

               const selectedUserId = familyMemberSelect.value;
               const itemName = presentNameInput.value.trim();
               const description = descriptionInput.value.trim();
               const link = linkInput.value.trim();

               if (!selectedUserId) {
                  alert("Please select a person from the dropdown first!");
                  return;
               }
               if (!itemName) {
                  alert("Please enter a name for the present!");
                  presentNameInput.focus();
                  return;
               }
               const newItem = { itemName, description, link };
               console.log("Attempting to add item:", newItem, "for user:", selectedUserId);
               const success = addWishlistItem(selectedUserId, newItem);
               if (success) {
                  console.log("Item added successfully to storage.");
                  addPresentForm.reset();
                  displayWishlistForUser(selectedUserId);
               } else {
                  console.error("Failed to add item to storage.");
                  alert("Could not add the wishlist item. Please check the console for errors.");
               }
            });
         } else {
            console.error("Could not find the #add-present-form element!");
         }
         // Initial display
         displayWishlistForUser(familyMemberSelect.value);

      } catch (error) {
         console.error("An error occurred during setup:", error);
         if (familyMemberSelect) {
            familyMemberSelect.innerHTML = '<option value="">Error loading data</option>';
         }
         if (wishlistDisplayArea) {
            wishlistDisplayArea.innerHTML = '<p>Could not initialize the application. Check console.</p>';
         }
      }
   } else {
      console.error('CRITICAL ERROR: Could not find element with ID "family-member-select"!');
      if (wishlistDisplayArea) {
         wishlistDisplayArea.innerHTML = '<p>Critical application error (dropdown not found). Check console.</p>';
      }
   }

   console.log("script.js initial execution finished.");
}; // End of window.onload