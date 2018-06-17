'use strict';
const Errors = require('./custom-errors.js');

/**
 * This deals with the business logic for mixing ingredient into potion.
 */
module.exports = class Mixer {

  constructor (datastore) {
    this._datastore = datastore;
  }
  /**
   * Mix items.
   */
  mix (userId, ingredientIds) {

    // First consume the ingredients before checking the potion, so the user cannot cheat.
    var currentUser = this.consume(userId, ingredientIds);

    //TODO: too much vs not enough ingredients.
    if (ingredientIds.length !== 3) {
      throw new Errors.NotEnoughIngredientsError("You have to use 3 ingredients to make a potion.");
    }

    const potions = this._datastore.getPotions();
    for (var potion of potions) {
      var isValidPotion = true;
      for (var ingredientId of ingredientIds) {
        isValidPotion = isValidPotion && potion.ingredients.includes(ingredientId);
      }
      if (isValidPotion) {
        // We found potion that matches the receipe of ingredients.
        return potion;
      } else {
        throw new Errors.NoPotionError("Too bad this potion doesn't exist");
      }
    }

  }

  /**
   * First validate that the ingredients are in the user inventory.
   * Then remove the ingredients from the inventory by making a DB call.
   */
  consume (userId, ingredientIds) {
    var currentUser = this.validInventory(userId, ingredientIds);
    // strongly consistent put.
    this._datastore.putUser(currentUser);
    return currentUser;
  }

  /**
   * Check the ingredients Id are in the user inventory.
   * - if not throw NotEnoughIngredientsError
   * - if ok return the new inventory without the ingredients
   */
  validInventory (userId, ingredientIds) {
    var currentUser = this._datastore.getUserById(userId);
    if (currentUser === null) {
      throw new Errors.NoUserError("UserID " +  userId + "doesn't exist.");
    }
    var inventory = currentUser.inventory;

    // Yes there is a double loop, but ingredientIds is only 3 length, and even
    // if it gets longer it's still small. This could actually be faster
    for (let ingredientId of ingredientIds) {
      var foundItem = inventory.find(function(element) {
        return element.ingredientId === ingredientId;
      });
      if (foundItem === undefined || foundItem.quantity <= 0 ) {
        throw new Errors.NotEnoughIngredientsError("It looks like you are trying to consume items you don't have.");
      } else {
        // decrease the quantity by one
        foundItem.quantity -= 1;
      }
    }
    // remove items with 0 quantity.
    currentUser.inventory = inventory.filter(element => element.quantity > 0);

    return currentUser;
  }

}
