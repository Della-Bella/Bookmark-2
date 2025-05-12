// This is a scaffolding file we have provided for you which allows you to manage stored data for your application.
// It can be loaded into index.html.
// You should not need to modify it to complete the project.

/**
 * Get a list of user ids
 *
 * @returns {string[]} List of user id strings
 */
export function getUserIds() {
  return ["Jack", "Isabella", "Mum", "Dad"];
}

/**
 * Get data associated with a specific user.
 *
 * @param {string} userId The user id to get data for
 * @returns {object[] | null} The data associated with the user (an array of wishlist items or null)
 */
export function getData(userId) {
  const data = localStorage.getItem(`stored-data-user-${userId}`);
  if (!data) {
    return null; // No data for this user, return null
  }
  try {
    const parsedData = JSON.parse(data);
    // Ensure what we parsed is actually an array
    return Array.isArray(parsedData) ? parsedData : null;
  } catch (e) {
    // console.error(`Error parsing data for user ${userId}:`, e); // Optional: for debugging
    return null; // Return null if parsing fails or data is not an array
  }
}

/**
 * Store data for a specific user.
 *
 * @param {string} userId The user id to store data for
 * @param {object[]} data The data to store (should be an array of wishlist items)
 */
export function setData(userId, data) {
  // Ensure data is an array before storing
  if (Array.isArray(data)) {
    localStorage.setItem(`stored-data-user-${userId}`, JSON.stringify(data));
  } else {
    console.error(`setData: Attempted to store non-array data for user ${userId}`, data);
  }
}

/**
 * Clears all data associated with a specific user. NOTE: This is provided to help with development, and is not required in the final code
 *
 * @param {string} userId The user id to clear associated data for
 */
export function clearData(userId) {
  localStorage.removeItem(`stored-data-user-${userId}`);
}

/**
 * Adds a new wishlist item for a specific user.
 *
 * @param {string} userId The user id to add the wish for.
 * @param {object} newItem The new wishlist item object (e.g., { itemName: "...", description: "...", link: "..." }).
 * @returns {boolean} True if the item was added successfully, false otherwise.
 */
export function addWishlistItem(userId, newItem) {
  if (!userId || !newItem || typeof newItem.itemName === 'undefined' || newItem.itemName.trim() === '') {
    console.error("addWishlistItem: Invalid userId or newItem (itemName is required).", { userId, newItem });
    return false; // Indicate failure or invalid input
  }

  try {
    // 1. Get the current wishlist for the user.
    let currentWishlist = getData(userId); // getData now more robust

    // 2. If there's no current wishlist (e.g., first item for this user),
    //    initialize it as an empty array.
    if (!currentWishlist) { // Handles null from getData correctly
      currentWishlist = [];
    }

    // 3. Add the new item to the array.
    currentWishlist.push(newItem);

    // 4. Save the updated wishlist back to storage using setData.
    setData(userId, currentWishlist);
    console.log(`Item added for ${userId}. New wishlist:`, currentWishlist);
    return true; // Indicate success
  } catch (error) {
    console.error(`Error adding wishlist item for ${userId}:`, error);
    return false; // Indicate failure
  }
}

//--- ADD THIS FUNCTION ---
/**
 * Deletes a specific wishlist item for a user.
 *
 * @param {string} userId The user id whose list to modify.
 * @param {number} itemIndex The index of the item to remove from the wishlist.
 * @returns {boolean} True if the item was deleted successfully, false otherwise.
 */
export function deleteWishlistItem(userId, itemIndex) {
  if (!userId || typeof itemIndex !== 'number' || itemIndex < 0) {
    console.error("deleteWishlistItem: Invalid userId or itemIndex.", { userId, itemIndex });
    return false;
  }

  try {
    let currentWishlist = getData(userId);
    if (currentWishlist && Array.isArray(currentWishlist) && itemIndex < currentWishlist.length) {
      const removedItemArray = currentWishlist.splice(itemIndex, 1);
      if (removedItemArray && removedItemArray.length > 0) {
        console.log(`Item removed for ${userId} at index ${itemIndex}:`, removedItemArray[0]);
      } else {
        console.log(`Splice did not return a removed item for ${userId} at index ${itemIndex}. List state:`, currentWishlist);
      }
      setData(userId, currentWishlist);
      console.log(`Updated wishlist for ${userId} after deletion:`, currentWishlist);
      return true;
    } else {
      console.warn(`deleteWishlistItem: Item at index ${itemIndex} not found for user ${userId}, or wishlist is empty/invalid.`, { currentWishlist });
      return false;
    }
  } catch (error) {
    console.error(`Error deleting wishlist item for ${userId} at index ${itemIndex}:`, error);
    return false;
  }
}
