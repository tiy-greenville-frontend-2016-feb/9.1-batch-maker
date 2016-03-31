var Parse = require('parse');
var Backbone = require('backbone');

var Recipe = Parse.Object.extend("Recipe", {
  totalWieght: function(){

  },
  calculate: function(){

  }
});

var cidCounter = 1;

var Ingredient = Parse.Object.extend("Ingredient", {
  initialize: function(){
    this.cid = cidCounter;
    cidCounter++;
    //return Parse.Object.prototype.initialize();
  }
});

var IngredientCollection = Backbone.Collection.extend({
  model: Ingredient
});

module.exports = {
  'Recipe': Recipe,
  'Ingredient': Ingredient,
  'IngredientCollection': IngredientCollection
};
