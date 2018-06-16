'use strict';

const express = require('express');
const datastore = require('./datastore.js');
const util = require('util')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello world\n');
});

app.get('/users', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const users = datastore.users;
  res.send(JSON.stringify(users));
});

app.get('/users/:userId', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const users = datastore.users;
  const userId = req.params.userId;

  var currentUser = getUserPerId(userId);
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

  const ingredients = datastore.ingredients;
  res.status(200).send(JSON.stringify(ingredients));
});

app.get('/ingredients/:ingredientId', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const ingredients = datastore.ingredients;
  const ingredientId = req.params.ingredientId;
  for (var ingredient of ingredients) {
    if(ingredient.id === ingredientId) {
      res.send(JSON.stringify(ingredient));
      return;
    }
  }
  res.status(404).send(JSON.stringify({
    "Error": "Ingredient id: " + userId + " doesn't exist"
  }));

  res.status(200).send(JSON.stringify(ingredients));
});

app.get('/potions', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const potions = datastore.potions;

  // Contains just the list of available potion but do not display the receipe
  var ofuscatedPotions = [];

  for(let potion of potions) {
    ofuscatedPotions.push(potion.name);
  }

  res.send(JSON.stringify(ofuscatedPotions));
});

function getUserPerId(userId) {
  const users = datastore.users;
  var currentUser = null;
  for (var user of users) {
    if (user.id === userId) {
      currentUser = user;
    }
  }
  return currentUser;
}

var server =  app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
module.exports = server;
