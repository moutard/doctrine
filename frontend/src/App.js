import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class MixItemForm extends Component {

  constructor(props) {
    super(props);

    this.selectedCheckboxes = this.props.selectedCheckboxes;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(ingredientId) {
    if (this.selectedCheckboxes.has(ingredientId)) {
      this.selectedCheckboxes.delete(ingredientId);
    } else {
      this.selectedCheckboxes.add(ingredientId);
    }
  }

  handleSubmit(event) {
    this.props.getMix();
    event.preventDefault();
  }

  render() {

    const inventory = this.props.inventory;
    const ingredients = this.props.ingredients;
    const handleCheckboxChange = this.props.handleCheckboxChange;
    var self = this;
    // make sure both are loaded.
    if (inventory && ingredients) {
      const listItems = inventory.map(function(item) {
        var itemData = ingredientPerId(ingredients, item.ingredientId);
        return (
          <InventoryItem
            name={itemData.name}
            ingredientId={item.ingredientId}
            image="./media/ingredient.png"
            quantity={item.quantity}
            handleChange={self.handleChange}
            selectedCheckboxes={self.selectedCheckboxes} />
        )
      }
      );
      return (
        <form id="InventoryForm" onSubmit={this.handleSubmit}>
          <div id="Inventory">
            <h1> Inventory </h1>
            <div class="InventoryListItems">{listItems}</div>
          </div>

          <div id="Mixer">
            <p className="App-intro">Pick 3 items of your inventory to create a potion. Choose wisely...</p>
            <img src="./media/arrow.png" className="arrow-logo" alt="logo" />

            <button class="MixButton" onClick={this.handleSubmit}>
              Mix your ingredients
            </button>
          </div>
        </form>

      );
    } else {
      return (
        <p>Empty inventory</p>
      );
    }
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        user: {},
        message: "You haven't selected ingredient yet.",
        selectedCheckboxes: new Set()
      };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src="./media/cauldron-white.png" className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to the Druid Potion Class {this.state.user.name}. </h1>
        </header>
        <ResultMessage message={this.state.message} />

        <div id="View">
          <MixItemForm inventory={this.state.user.inventory} ingredients={this.state.ingredients} getMix={this.getMix} selectedCheckboxes={this.state.selectedCheckboxes}/>
          <PotionsBag userPotions={this.state.user.potions} allPotions={this.state.potions}/>
        </div>
      </div>
    );
  }

  refresh () {
    this.getUser()
      .then(res => this.setState({ user: res }))
      .catch(err => console.log(err));

    this.state.selectedCheckboxes.clear();

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

  getMix = async () => {
    var selectedCheckboxes = []
    this.state.selectedCheckboxes.forEach(function(value) {
      selectedCheckboxes.push(value);
    });
    console.log(selectedCheckboxes.join('-'))
    const response = await fetch('/users/12/mix/' + selectedCheckboxes.join('-'), {
          method: 'PUT'
    });
    const body = await response.json();
    if (response.status !== 200) {
      this.setState({message: body.Error});
    } else {
      this.setState({message: body.Message});
    }
    this.refresh();

    return body;
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

class InventoryItem extends Component {
  state = {
    isChecked: false,
  }

  toggleCheckboxChange = () => {
    const { handleChange, ingredientId } = this.props;

    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked,
      }
    ));

    handleChange(ingredientId);
  }

  render () {
    const { ingredientId } = this.props;
    const { isChecked } = this.state;

    return (
      <div class="InventoryItem">
        <img class="InventoryItemImage" src={this.props.image} alt={this.props.name}/>
        <div class="InventoryItemInfo">
          <h4>{this.props.name}</h4>
          <h5>quantity: {this.props.quantity}</h5>
        </div>

        <input
          class="InventoryItemSelect"
          type="checkbox"
          checked={this.props.selectedCheckboxes.has(ingredientId)}
          value={ingredientId}
          onChange={this.toggleCheckboxChange} />
      </div>
    );
  }

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
        <img class="PotionItemImage" src="./media/potion-empty.png" alt="empty potion" />
        <p>You do not have any potion yet.</p>
      </div>
    );
  }
}

function Potion(props) {
  return (
    <div class="InventoryItem">
      <img class="InventoryItemImage" src={props.image} alt={props.name}/>
      <div class="InventoryItemInfo">
        <h4>{props.name}</h4>
        <h5>quantity: {props.quantity}</h5>
      </div>
    </div>
  )
}

function ResultMessage(props) {
  return (
    <div class="ResultMessage">
      {props.message}
    </div>
  )
}

export default App;
