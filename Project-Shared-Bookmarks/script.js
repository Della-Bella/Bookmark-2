// get data for storage.js
import { getUserIds, getData } from "./storage.js";


// whait for the html to be load to start js
window.onload = function () {
   const users = getUserIds();
   //document.querySelector("body").innerText = `There are ${users.length} users`;
};
console.log("main.js loaded");

// 1= starting JS= Populating DropDonw Menu

// find dropdonw in the html and creat a variable to it

const familyMemberSelect = document.getElementById("family-member-select");
const presentNameInput = document.getElementById('present-name'); // Use the actual ID from your HTML
const descriptionInput = document.getElementById('present-description'); // Use the actual ID
const linkInput = document.getElementById('present-url');             // Use the actual ID
const addToWishlistButton = document.getElementById('add-to-wishlist-button');
const wishlistDisplayArea = document.getElementById("wishlist-display");

//safety / error= adding secury code to check if code find the "familyMemberSelect" elemnt avoid break the all script.so add the IF (BEFORE) and Else(end) OF THE LOOP.
if (familyMemberSelect) {
   console.log("Found the dropdown element");

   try {
      // if YES= run the function
      const familyMemberIds = getUserIds();
      console.log("print IDs:", familyMemberIds);

      //LOOP:

      familyMemberIds.forEach((memberId) => {

        //1- CREAT VARIABLE FOR "OTIONS"
         const optionElement = document.createElement("option");

        //create variables for value ( invisible) text(visible)
         optionElement.value = memberId;
         optionElement.textContent = memberId;///create waht show in the browser

        // append/ creat elemnte Child inside parent in the HTML
         familyMemberSelect.appendChild(optionElement);
         //error safty:
      }); // End of the loop FIRST PART OF THE CODE =DROPDONW MENU

      console.log("Dropdown working.");

     // 2= PART OF CODE AFTER DROPDOWNMENU BEEN POPULATE/Dropdown Selection= USER 

     familyMemberSelect.addEventListener('change', function () {
       console.log("Dropdown selection changed!");


        const selectedUserId = this.value;
       console.log(`User selected ID: ${selectedUserId}`);
       
     // END OF 2 CODE Dropdown Selection= USER

     // 5= DISPLAY WHISHLIST:
     //  Before starting display Whislist IMPORTANT CLEAR DISPLAY AREA:

   
      // 1 = CREAT VARIABLE / found html  display area
        // a) Clear the previous display area
     
        if (wishlistDisplayArea) {
           wishlistDisplayArea.innerHTML = ''; // Clear content
           console.log("Cleared the wishlist display area.");
        } else {
           console.error("Could not find the #wishlist-display element!");
        }

        //3= Dislay text for each Whislist Id user: Dad Whishlist. 
        //creat prcurar id no HTML for Select-name 
        const selectedPersonNameSpan = document.getElementById("selected-person-name");

        // 4= chche if it is tehre 
        if (selectedPersonNameSpan) {
           // 5. Update the text content of the span

           if (selectedUserId) {
              selectedPersonNameSpan.textContent = `${selectedUserId}'s Wishlist`; // "Dad's Wishlist"
              console.log(`Updated heading span to: ${selectedPersonNameSpan.textContent}`);// check code
           } else {
              // Handle the case where the "-- Select a Person --" option is chosen
              selectedPersonNameSpan.textContent = 'Wishlist'; // Reset to generic
              console.log("Reset heading span to generic 'Wishlist'.");
           }
        } else {
           // Log an error if the name span couldn't be found
           console.error("Could not find the #selected-person-name element!");
        }

        // ---> START OF GET DATA FROM THE USER <---

        // A user ID is selected, START TO COLLECT THE data:

        if (selectedUserId) {
           console.log(`Attempting to fetch data for user: ${selectedUserId}`);

           // Call getData and store the result
           const userWishlistItems = getData(selectedUserId);//the userWishlistItems variable. This variable holds the wishlist items (or null, or an empty array) for the selected user.c

           // Log what was returned to see if it worked and what the data looks like
           console.log("Data received from getData():", userWishlistItems);

           // START SHOWING ITENS IN DIPLAY

           if (userWishlistItems && userWishlistItems.length > 0) {
              console.log(`Found ${userWishlistItems.length} items to display.`);

              userWishlistItems.forEach((wishlistItem) => {
                 console.log("Currently displaying item:", wishlistItem);

                 const itemElement = document.createElement("div");
                 itemElement.classList.add("wishlist-item"); // Add a class for styling

                 if (typeof wishlistItem === 'object' && wishlistItem !== null) {
                    // 1. Display Present Name (itemName)
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

                    // 2. Display Description / Notes
                    if (wishlistItem.description) {
                       const descriptionElement = document.createElement("p");
                       descriptionElement.textContent = wishlistItem.description;
                       descriptionElement.style.fontSize = "0.9em";
                       descriptionElement.style.color = "#333";
                       descriptionElement.style.marginBottom = "5px";
                       itemElement.appendChild(descriptionElement);
                    }

                    // 3. Display Link
                    if (wishlistItem.link) {
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
                       // linkElement.style.marginTop = "5px"; // Uncomment if you want more top margin for the link
                       itemElement.appendChild(linkElement);
                    }
                 } else if (typeof wishlistItem === 'string') {
                    // Fallback if an item is just a string
                    itemElement.textContent = wishlistItem;
                 } else {
                    // Fallback for unknown item format
                    itemElement.textContent = "Invalid item data.";
                    console.warn("Encountered an item with an unexpected format:", wishlistItem);
                 }

                 // Optional styling for the item container
                 itemElement.style.border = "1px solid #ddd";
                 itemElement.style.padding = "10px 15px";
                 itemElement.style.marginBottom = "10px";
                 itemElement.style.borderRadius = "5px";
                 itemElement.style.backgroundColor = "#f9f9f9";

                 if (wishlistDisplayArea) { // Ensure wishlistDisplayArea is still valid
                    wishlistDisplayArea.appendChild(itemElement);
                 } else {
                    console.error("Wishlist display area became unavailable while adding items.");
                 }
              }); // End of forEach loop

           } else if (userWishlistItems && userWishlistItems.length === 0) {
              console.log("This user has no wishlist items yet.");
              if (wishlistDisplayArea) {
                 const noItemsMessage = document.createElement("p");
                 noItemsMessage.textContent = "This person hasn't added any wishes yet!";
                 noItemsMessage.style.fontStyle = "italic";
                 wishlistDisplayArea.appendChild(noItemsMessage);
              }
           } else {
              // This case handles if userWishlistItems is null (e.g., user not found in storage)
              // or some other unexpected return from getData()
              console.log("No wishlist data available for this user or an error occurred.");
              if (wishlistDisplayArea) {
                 const errorMessage = document.createElement("p");
                 errorMessage.textContent = "Could not load wishlist items at this time.";
                 wishlistDisplayArea.appendChild(errorMessage);
              }
           }






           
        } else {
           // selectedUserId is empty ( "-- Select --")
           console.log("No specific user selected. Display area will remain empty.");
        }

        
        

        
     }); // END EVENT LISTENER FUNCTION

   } catch (error) {
      //  if Step 3 getUserIds or looping failed:
      console.error(
         "An error occurred while getting IDs or creating options:",
         error
      );
      //  Show an error in the dropdown itself
      familyMemberSelect.innerHTML =
         '<option value="">Error loading data</option>';
   }
} else {
   // If NO, we did NOT find the dropdown element in the HTML.
   // This usually means a typo in the ID in HTML or JavaScript.
   console.error(
      'CRITICAL ERROR: Could not find element with ID "family-member-select"!'
   );
}
console.log("script.js initial execution finished."); // Log script end




   
