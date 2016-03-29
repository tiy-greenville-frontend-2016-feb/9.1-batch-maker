var React = require('react');
var ReactDOM = require('react-dom');
var LinkedStateMixin = require('react/lib/LinkedStateMixin');
var Input = require('react-bootstrap/lib/Input');
var ButtonInput = require('react-bootstrap/lib/ButtonInput');
var Parse = require('parse');
var ParseReact = require('parse-react');

var models = require('../models');

// Setup parse
Parse.initialize("tiygvl");
Parse.serverURL = 'http://tiny-parse-server.herokuapp.com';

var IngredientFormset = React.createClass({
  render: function(){
    return (
      <div className="form-inline">
        <h3>Ingredient #{this.props.count}</h3>
        <Input ref={"qty" + this.props.count} type="text" name={"qty" + this.props.count} placeholder="qty"/>
        <Input ref={"units" + this.props.count} type="text" name={"units" + this.props.count} placeholder="units"/>
        <Input ref={"name" + this.props.count} type="text" name={"name" + this.props.count} placeholder="name"/>
      </div>
    )
  }
});


var AddRecipeView = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return {title: '', notes: '', ingredientCount: 2};
  },
  handleSubmit: function(event){
    event.preventDefault();
    var self = this;
    var router = this.props.router;
    var recipe = new models.Recipe();
    recipe.set({
      "title": this.state.title,
      "notes": this.state.notes
    });

    recipe.save(null, {
      success: function(recipe) {
        // Execute any logic that should take place after the object is saved.
        alert('New object created with objectId: ' + recipe.id);
        var recipeIngredients = [];

        for(var i=1; i <= self.state.ingredientCount; i++){
          // Get ingredient formset values
          console.log("formset: ", i, self.refs["formset"+i]);

          var qty = self.refs["formset"+i].refs["qty"+i].getInputDOMNode().value;
          var units = self.refs["formset"+i].refs["units"+i].getInputDOMNode().value;
          var name = self.refs["formset"+i].refs["name"+i].getInputDOMNode().value;

          // Setup parse object (model)
          var ingredient = new models.Ingredient();
          ingredient.set('qty', parseInt(qty));
          ingredient.set('units', units);
          ingredient.set('name', name);
          ingredient.set('recipe', recipe);

          // Push parse obj to array for batch saving
          recipeIngredients.push(ingredient);
        }

        console.log(recipeIngredients);

        // Batch save all ingredients
        Parse.Object.saveAll(recipeIngredients, {
          success: function(list) {
            alert('ing saved!');
          },
          error: function(error) {
            console.log(error);
          }
        });
        router.navigate('recipes/', {trigger: true});
      },
      error: function(recipe, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        alert('Failed to create new object, with error code: ' + error.message);
      }
    });
  },
  addIngredient: function(event){
    event.preventDefault();
    var newCount = this.state.ingredientCount + 1;
    this.setState({'ingredientCount': newCount});
  },
  render: function(){

    var ingredientForms = [];
    for(var i=1; i<= this.state.ingredientCount; i++){
      var count = i;
      ingredientForms.push(<IngredientFormset key={count} count={count} ref={"formset"+count}/>);
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <Input type="text" label="Recipe Title" placeholder="Enter title" valueLink={this.linkState('title')} />
        <Input type="textarea" label="Recipe Notes" placeholder="Enter notes" valueLink={this.linkState('notes')} />

        <div className="col-md-6">
          <h2>Ingredients</h2>
        </div>
        <div className="col-md-6 text-right">
          <button className="btn btn-primary" onClick={this.addIngredient}>+ Add</button>
        </div>

        {ingredientForms}

        <ButtonInput type="submit" value="Add Recipe" />
      </form>
    );
  }
});


var RecipeListView = React.createClass({
  mixins: [ParseReact.Mixin], // Enable query subscriptions

  observe: function() {
    // Subscribe to all Recipe objects, ordered by creation date
    // The results will be available at this.data.recipes
    return {
      recipes: (new Parse.Query('Recipe')).descending('createdAt')
    };
  },

  render: function(){
    return (
        <ul>
          {this.data.recipes.map(function(recipe) {
            return <li key={recipe.id}>{recipe.title}:: {recipe.notes}</li>;
          })}
        </ul>
      );
  }
});


module.exports = {
  AddRecipeView: AddRecipeView,
  RecipeListView: RecipeListView
};
