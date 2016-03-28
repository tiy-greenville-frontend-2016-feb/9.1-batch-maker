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


var AddRecipeView = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return {title: '', notes: ''};
  },
  handleSubmit: function(event){
    event.preventDefault();

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
        router.navigate('recipes/', {trigger: true});
      },
      error: function(recipe, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        alert('Failed to create new object, with error code: ' + error.message);
      }
    });
  },
  render: function(){
    return (
      <form onSubmit={this.handleSubmit}>
        <Input type="text" label="Recipe Title" placeholder="Enter title" valueLink={this.linkState('title')} />
        <Input type="textarea" label="Recipe Notes" placeholder="Enter notes" valueLink={this.linkState('notes')} />
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
      recipes: (new Parse.Query('Recipe')).ascending('createdAt')
    };
  },

  render: function(){
    return (
        <ul>
          {this.data.recipes.map(function(recipe) {
            return <li key={recipe.id}>{recipe.title}</li>;
          })}
        </ul>
      );
  }
});


module.exports = {
  AddRecipeView: AddRecipeView,
  RecipeListView: RecipeListView
};
