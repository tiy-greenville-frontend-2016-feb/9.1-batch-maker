var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');
var Parse = require('parse');

var AddRecipeView = require('./components/index.jsx').AddRecipeView;
var RecipeListView = require('./components/index.jsx').RecipeListView;

var appContainer = document.getElementById('app');

var Router = Backbone.Router.extend({
  routes: {
    '': 'index', // recipe add
    'recipes/add/': 'recipesAddEidt', // recipe add
    'recipes/:id/': 'recipesAddEidt', // recipe edit
    'recipes/': 'recipes',  // recipe list
  },

  index: function(){
    this.navigate('recipes/', {trigger: true});
  },
  recipesAddEidt: function(id){
    var self = this;

    ReactDOM.unmountComponentAtNode(appContainer);

    ReactDOM.render(
      React.createElement(AddRecipeView, {router: self, recipeId: id}),
      appContainer
    );
  },
  recipes: function(){
    ReactDOM.unmountComponentAtNode(appContainer);

    ReactDOM.render(
      React.createElement(RecipeListView),
      appContainer
    );
  }
});

module.exports = new Router();
