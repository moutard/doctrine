# Doctrine

*Le but est de créer un « simulateur » de création de potions alchimiques avec un backend Node.js.*

Le principe de l’interface est le suivant, vous sélectionnez 3 ingrédients et cliquez sur un bouton « Mélanger » qui produit une potion magique. Exemple : je clique sur « Jus de citron », « Pattes de pigeon » et « Piment » et je clique sur « Mélanger ». Il s’affiche alors « Invisibilité » qui est la potion que j’ai créée. Si le mélange ne correspond à aucune recette magique enregistrée, il s’affiche « Recette incorrecte » par exemple. Dans tous les cas, les ingrédient consommés doivent être retirés de l’inventaire.


## Setup

To test and edit the service locally, follow those instructions
```
git clone <url-repo>
cd doctrine
npm install
```

## Code Structure

1. **backend**
-> provided by expressjs. This is a REST API with methods like /potions, /ingredients etc...

2. **frontend**
-> provided by react. A small UI that calls the previous API.

## Test

We use mocha and supertest for unittests. they only test the server side for now. To run the test just run the command

```
mocha
```

if you want to debug

```
mocha debug
```

## Run

As mentionned previously you need the API to run and the react server to provide the UI.

```
node server
```

in a different terminal

```
cd frontend
npm start
```

The interface will be available on http://localhost:3000/
