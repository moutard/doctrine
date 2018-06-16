'use strict';

/**
 * This file contains all the data, that should
 * be stored in a database.
 * I would use NoSQL datastore, like dynamoDB.
 *
 */
exports.users = [
  {
    "id": "12",
    "name": "raphael",
    "inventory": [{"ingredientId": "3", "quantity": 1}, {"ingredientId": "6", "quantity": 3}, {"ingredientId": "9", "quantity": 7}],
    "potions": []
  },
  {
    "id": 13,
    "name": "melvil",
    "inventory": [{"ingredientId": "3", "quantity": 2}, {"ingredientId": "6", "quantity": 3}, {"ingredientId": "9", "quantity": 7}],
    "potions": []
  },
];

exports.ingredients = [
  {
    "id": "1",
    "name": "Vinaigre",
    "image": "",
    "probability": 0.1
  },
  {
    "id": "2",
    "name": "Tete de Rat",
    "image": "",
    "probability": 0.1
  },
  {
    "id": "3",
    "name": "Bave de Lama",
    "image": "",
    "probability": 0.1
  },
  {
    "id": "4",
    "name": "Persil",
    "image": "",
    "probability": 0.1
  },
  {
    "id": "5",
    "name": "Epines de Herisson",
    "image": "",
    "probability": 0.1
  },
  {
    "id": "6",
    "name": "Argent",
    "image": "",
    "probability": 0.1
  },
  {
    "id": "7",
    "name": "Or",
    "image": "",
    "probability": 0.1
  },
  {
    "id": "8",
    "name": "Diamant",
    "image": "",
    "probability": 0.1
  },
  {
    "id": "9",
    "name": "Fletan",
    "image": "",
    "probability": 0.1
  },
  {
    "id": "10",
    "name": "Poil de phacochere",
    "image": "",
    "probability": 0.1
  },
  {
    "id": "11",
    "name": "Helium liquide",
    "image": "",
    "probability": 0.1
  },
  {
    "id": "12",
    "name": "Sel de l'himalaya",
    "image": "",
    "probability": 0.1
  }
];

exports.potions = [
  {
    "id": 0,
    "name": "Potion de vie",
    "description": "Rend instantanément 60 % points de vie.",
    "ingredients": ["1", "5", "9"],
    "image": "health-potion-red.png"
  },
  {
    "id": 1,
    "name": "Potion d'amour",
    "description": "Les enemis arretent de vous attaquer pendant 3s.",
    "ingredients": ["10", "11", "12"],
    "image": "love-potion-pink.png"
  },

  {
    "id" : 2,
    "name": "Potion de Mana",
    "description": "Rend instantanément 50 % points de mana.",
    "ingredients": ["20", "11", "14"],
    "image": "mana-potion-blue.png"
  },
  {
    "id": 3,
    "name": "Potion de poison",
    "description": "Tue tous les ennemis a proximité",
    "ingredients": ["27", "26", "25"],
    "image": "poison-potion-green.png"
  },
  {
    "id": 4,
    "name": "Potion de force",
    "description": "Augmente tous vos degats de 40%.",
    "ingredients": ["12", "17", "19"],
    "image": "science-potion-purple.png"
  }
];
