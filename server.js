'use strict';

const express = require('express');
const util = require('util')

const Datastore = require('./datastore.js');
const data = require('./data.js');
const Mixer = require('./mixer.js');
const Errors = require('./custom-errors.js')


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const datastore = new Datastore(data);
const mixer = new Mixer(datastore);


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
    var _oPotion = Object.assign({}, potion);
    delete _oPotion.ingredients;
    ofuscatedPotions.push(_oPotion);
  }

  res.send(JSON.stringify(ofuscatedPotions));
});

app.put('/users/:userId/mix/:ingredientIds', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const userId = req.params.userId;
  const ingredientIds = req.params.ingredientIds.split("-");

  try {
    var potion = mixer.mix(userId, ingredientIds);
    res.send(JSON.stringify({
      "Message": "Great you just aquired " + potion.name
    }));
    return;
  } catch (e) {
    if (e instanceof Errors.NotEnoughIngredientsError) {
      // statements to handle TypeError exceptions
      res.status(403).send(JSON.stringify({
        "Error": e.message
      }));
      return;
    } else if (e instanceof Errors.NoPotionError) {
    // statements to handle RangeError exceptions  // No valid potion was found
      res.status(404).send(JSON.stringify({
        "Error": e.message
      }));
      return;
    } else {
      // statements to handle RangeError exceptions  // No valid potion was found
        res.status(500).send(JSON.stringify({
          "Error": e.message
        }));
        return;
    }
  }
});

/**
 * Consume some ingredients, remove them from the inventory.
 * This needs to be atomic, you need to check the
 */
app.put('/users/:userId/consume/:ingredientIds', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const userId = req.params.userId;
  const ingredientIds = req.params.ingredientIds.split("-");

  try {
    var currentUser = mixer.consume(userId, ingredientIds);
    // return the updated user with new inventory.
    res.send(JSON.stringify(currentUser));
    return;
  } catch (e) {
    if (e instanceof Errors.NoUserError) {
      // statements to handle TypeError exceptions
      res.status(404).send(JSON.stringify({
        "Error": e.message
      }));
      return;
    } else if (e instanceof Errors.NotEnoughIngredientsError) {
      // statements to handle RangeError exceptions  // No valid potion was found
      res.status(403).send(JSON.stringify({
        "Error": e.message
      }));
      return;
    } else {
      res.status(500).send(JSON.stringify({
        "Error": e.message
      }));
      return;
    }
  }
});

/**
 * Reset the datastore as some of the write api calls are stateful.
 */
function reset() {
  delete require.cache[require.resolve('./data')];
  datastore.reset(require('./data.js'));
}

var server =  app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
module.exports = server;
module.exports.reset = reset;
