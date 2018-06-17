'use strict';

const express = require('express');
const Datastore = require('./datastore.js');
const data = require('./data.js');

const util = require('util')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const datastore = new Datastore();

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello world\n');
});

app.get('/users', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const users = datastore.getUsers();
  res.send(JSON.stringify(users));
});

app.get('/users/:userId', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const users = datastore.getUsers();
  const userId = req.params.userId;

  var currentUser = datastore.getUserById(userId);
  if (currentUser) {
    res.send(JSON.stringify(currentUser));
    return;
  }
  res.status(404).send(JSON.stringify({
    "Error": "User id: " + userId + " doesn't exist"
  }));
});

app.get('/ingredients', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const ingredients = datastore.getIngredients();
  res.status(200).send(JSON.stringify(ingredients));
});

app.get('/ingredients/:ingredientId', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const ingredient = datastore.getIngredientsById(req.params.ingredientId)
  if (ingredient) {
    res.send(JSON.stringify(ingredient));
    return;
  }

  res.status(404).send(JSON.stringify({
    "Error": "Ingredient id: " + req.params.ingredientId + " doesn't exist"
  }));

});

app.get('/potions', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const potions = datastore.getPotions();

  // Contains just the list of available potion but do not display the receipe
  var ofuscatedPotions = [];

  for(let potion of potions) {
    ofuscatedPotions.push(potion.name);
  }

  res.send(JSON.stringify(ofuscatedPotions));
});

app.get('/users/:userId/mix/:ingredientIds', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const userId = req.params.userId;
  const ingredientIds = req.params.ingredientIds.split("-");

  if (ingredientIds.length !== 3) {
    res.status(403).send(JSON.stringify({
      "Error": "You have to use 3 ingredients to make a potion."
    }));
    return;
  }
  //TODO: too much vs not enough ingredients.

  const potions = datastore.getPotions();
  for (var potion of potions) {
    var isValidPotion = true;
    for (var ingredientId of ingredientIds) {
      isValidPotion = isValidPotion && potion.ingredients.includes(ingredientId);
    }
    if (isValidPotion) {
      // We found potion that matches the receipe of ingredients.

      // TODO: remove the ingredients from the user inventory

      //
      res.send(JSON.stringify({
        "Message": "Great you just aquired " + potion.name
      }));
      return;

    }
  }

  // No valid potion was found
  res.status(404).send(JSON.stringify({
    "Error": "Too bad this potion doesn't exist"
  }));
  return;

});

/**
 * Consume some ingredients, remove them from the inventory.
 * This needs to be atomic, you need to check the
 */
app.put('/users/:userId/consume/:ingredientIds', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const userId = req.params.userId;
  const ingredientIds = req.params.ingredientIds.split("-");

  var currentUser = datastore.getUserById(userId);
  if (currentUser === null) {
    res.status(404).send(JSON.stringify({
      "Error": "UserID " +  userId + "doesn't exist."
    }));
    return;
  }
  var inventory = currentUser.inventory;
  // Yes there is a double loop, but ingredientIds is only 3 length, and even
  // if it gets longer it's still small. This could actually be faster
  for (let ingredientId of ingredientIds) {
    var foundItem = inventory.find(function(element) {
      return element.ingredientId === ingredientId;
    });
    if (foundItem === undefined || foundItem.quantity <= 0 ) {
      res.status(403).send(JSON.stringify({
        "Error": "It looks like you are trying to consume items you don't have."
      }));
      return;
    } else {
      // decrease the quantity by one
      foundItem.quantity -= 1;
    }
  }
  // remove items with 0 quantity.
  currentUser.inventory = inventory.filter(element => element.quantity > 1);

  // strongly consistent put.
  datastore.putUser(currentUser);

  // return the updated user with new inventory.
  res.send(JSON.stringify(currentUser));
  return;
});

var server =  app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
module.exports = server;
