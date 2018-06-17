import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    user: {},
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src="./media/cauldron-white.png" className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to the Druid Potion Class {this.state.user.name}. </h1>
        </header>

        <div id="View">
          <Inventory inventory={this.state.user.inventory} ingredients={this.state.ingredients} />

          <div id="Mixer">
            <p className="App-intro">Pick 3 items of your inventory to create a potion. Choose wisely...</p>
            <img src="./media/arrow.png" className="arrow-logo" alt="logo" />

            <button class="MixButton" onclick="onPressMix()">
              Mix your ingredients
            </button>

          </div>

          <PotionsBag userPotions={this.state.user.potions} allPotions={this.state.potions}/>
        </div>
      </div>
    );
  }

  onPressMix () {
     console.log('The link was clicked.');
  }

  componentDidMount() {
    this.getUser()
      .then(res => this.setState({ user: res }))
      .catch(err => console.log(err));

    this.getIngredients()
        .then(res => this.setState({ ingredients: res }))
        .catch(err => console.log(err));

    this.getPotions()
      .then(res => this.setState({ potions: res }))
      .catch(err => console.log(err));
  }

  getPotions = async () => {
    const response = await fetch('/potions');
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  }

  getUser = async () => {
    const response = await fetch('/users/12');
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  }

  getIngredients = async () => {
    const response = await fetch('/ingredients');
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  };
}

function Inventory(props) {
  const inventory = props.inventory;
  const ingredients = props.ingredients;
  // make sure both are loaded.
  if (inventory && ingredients) {
    const listItems = inventory.map(function(item) {
      var itemData = ingredientPerId(ingredients, item.ingredientId);
      return (
          <InventoryItem name={itemData.name} image="./media/ingredient.png" quantity={item.quantity} />
      )
    }

    );
    return (
      <div id="Inventory">
        <h1> Inventory </h1>
        <div class="InventoryListItems">{listItems}</div>
      </div>
    );
  } else {
    return (
      <p>Empty inventory</p>
    );
  }
}

function InventoryItem(props) {
  return (
    <div class="InventoryItem">
      <img class="InventoryItemImage" src={props.image} alt={props.name}/>
      <div class="InventoryItemInfo">
        <h3>{props.name}</h3>
        <h5>quantity: {props.quantity}</h5>
      </div>
      <input class="InventoryItemSelect" type="checkbox" />
    </div>
  );
}

function ingredientPerId(ingredients, id) {
  for (var ingredient of ingredients) {
    if(ingredient.id === id) {
      return ingredient;
    }
  }
  return null;
}

function PotionsBag(props) {
  const userPotions = props.userPotions;
  const allPotions = props.allPotions;

  // make sure both are loaded.
  if (userPotions && userPotions.length > 0 && allPotions) {
    const listItems = userPotions.map(function(potion) {
      var potionData = ingredientPerId(allPotions, potion.potionId);
      return (
          <Potion name={potionData.name} image={potionData.image} quantity={potion.quantity} />
      )
    }

    );
    return (
      <div id="PotionsBag">
        <h1> Potions Bag </h1>
        <div class="InventoryListItems">{listItems}</div>
      </div>
    );
  } else {
    return (
      <div id="PotionsBag">
        <h1> Potions Bag </h1>
        <img src="./media/potion-empty.png" alt="empty potion" />
        <p>You do not have any potion yet.</p>
      </div>
    );
  }
}

function Potion(props) {
  return (
    <div class="Potion">
      <img class="InventoryItemImage" src={props.image} alt={props.name}/>
      <div class="InventoryItemInfo">
        <h3>{props.name}</h3>
        <h5>quantity: {props.quantity}</h5>
      </div>
    </div>
  )
}
export default App;
