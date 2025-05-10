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
 * @returns {any | null} The data associated with the user
 */
export function getData(userId) {
  return JSON.parse(localStorage.getItem(`stored-data-user-${userId}`));
}

/**
 * Store data for a specific user.
 *
 * @param {string} userId The user id to store data for
 * @param {any} data The data to store
 */
export function setData(userId, data) {
  localStorage.setItem(`stored-data-user-${userId}`, JSON.stringify(data));
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
    //    getData might return null if the user has no items yet.
    let currentWishlist = getData(userId);

    // 2. If there's no current wishlist (e.g., first item for this user),
    //    initialize it as an empty array.
    if (!currentWishlist || !Array.isArray(currentWishlist)) {
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
    // 1. Get the current wishlist for the user.
    let currentWishlist = getData(userId);

    // 2. Check if the wishlist exists and the index is valid.
    if (currentWishlist && Array.isArray(currentWishlist) && itemIndex < currentWishlist.length) {
      // 3. Remove the item at the specified index.
      //    `splice` modifies the array in place and returns an array of removed items.
      currentWishlist.splice(itemIndex, 1);

      // 4. Save the updated wishlist back to storage.
      setData(userId, currentWishlist);
      console.log(`Item at index ${itemIndex} deleted for ${userId}. New wishlist:`, currentWishlist);
      return true; // Indicate success
    } else {
      console.warn(`deleteWishlistItem: Item at index ${itemIndex} not found for user ${userId}, or wishlist is empty/invalid.`, { currentWishlist });
      return false; // Indicate item not found or invalid index
    }
  } catch (error) {
    console.error(`Error deleting wishlist item for ${userId} at index ${itemIndex}:`, error);
    return false; // Indicate failure
  }
}