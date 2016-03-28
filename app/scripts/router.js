var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');

var IndexComponent = require('./compoents/index.jsx').IndexComponent;

var appContainer = document.getElementById('app');

var Router = Backbone.Router.extend({
  routes: {
      '': 'index', // recipe list
      // 'recipe/create': 'newRecipe',
      // 'recipe/:id': 'recipe',
      // 'recipe/:id/edit': 'recipeEdit',
      // 'recipe/:id/delete': 'recipeDelete',
      // 'recipe/category(/:type)': 'type',
      // 'recipe/category': 'type',
      // 'login': 'login',
      // 'profile/:id': 'profile',
      // '*notFound': 'catch'
    },

  index: function(){
    ReactDOM.unmountComponentAtNode(appContainer);

    ReactDOM.render(
      React.createElement(IndexComponent),
      appContainer
    );
  },
  addRecipe: function(){
    ReactDOM.unmountComponentAtNode(appContainer);

    ReactDOM.render(
      React.createElement(AddRecipeComponent),
      appContainer
    );
  },
  login: function(){
    Parse.User.logIn("myname", "mypass", {
      success: function(user) {
        this.navigate('profile/' + user.id, {trigger: true}); // profile/10
      },
      error: function(user, error) {
        // The login failed. Check error to see why.
      }
    });
  },
});
