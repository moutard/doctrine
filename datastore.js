'use strict';

const data = require('./data.js');


/**
 * Datastore is an interface for your storage.
 * I store the data in a simple raw file, but it could be linked
 * to a database. The idea is that whatever the storage is, the
 * the business code shouldn't change.
 */
module.exports = class Datastore {

  constructor() {
    // Do some setup to connect to the database.
  }

  getUsers() {
    return JSON.parse(JSON.stringify(data.users));
  }

  getUserById(userId) {
    const users = data.users;
    var currentUser = null;
    for (var user of users) {
      if (user.id === userId) {
        // Deep copy to avoid modifying the object itself.
        // That would be what we get from a real NoSQL datastore.
        currentUser = JSON.parse(JSON.stringify(user));
      }
    }
    return currentUser;
  }

  getIngredients() {
    return data.ingredients;
  }

  getIngredientsById(ingredientId) {
    const ingredients = data.ingredients;
    var currentIngredient = null;
    for (var ingredient of ingredients) {
      if(ingredient.id === ingredientId) {
        // Deep copy to avoid modifying the object itself.
        // That would be what we get from a real NoSQL datastore.
        currentIngredient = JSON.parse(JSON.stringify(user));
      }
    }
    return currentIngredient;
  }

  getPotions() {
    return JSON.parse(JSON.stringify(data.potions));
  }

  /**
   * This should be strongly consistent write, for distributed system.
   */
  putUser(user) {
    const users = data.users;
    var foundUserIndex = users.findIndex(element => element.id === user.id);
    if (foundUserIndex === -1) {
      data.users.push(user);
    } else {
      data.users[foundUserIndex] = user;
    }
  }

};
