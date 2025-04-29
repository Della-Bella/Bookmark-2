// get data for storage.js
import { getUserIds } from "./storage.js";

console.log("main.js loaded");

// whait for the html to be load to start js
window.onload = function () {
   const users = getUserIds();
   //document.querySelector("body").innerText = `There are ${users.length} users`;
};
console.log("main.js loaded");

// starting JS= Populating DropDonw Menu

// find dropdonw in the html and creat a variable to it

const familyMemberSelect = document.getElementById("family-member-select");

//safety / error= adding secury code to check if code find the "familyMemberSelect" elemnt avoid break the all script.so add the IF (BEFORE) and Else(end) OF THE LOOP.
if (familyMemberSelect) {
   console.log("Found the dropdown element. Attempting to populate...");

   try {
      // if YES= run the function
      const familyMemberIds = getUserIds();
      console.log("Retrieved family member IDs:", familyMemberIds);

      //LOOP:

      familyMemberIds.forEach((memberId) => {

        //1- CREAT VARIABLE FOR "OTIONS"
         const optionElement = document.createElement("option");

        //create variables for value ( invisible) text(visible)
         optionElement.value = memberId;
         optionElement.textContent = memberId;

        // append/ creat elemnte Child inside parent in the HTML
         familyMemberSelect.appendChild(optionElement);
         //error safty:
      }); // End of the loop for one memberId

      console.log("Dropdown population complete.");

      //End of chechink Error:
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
