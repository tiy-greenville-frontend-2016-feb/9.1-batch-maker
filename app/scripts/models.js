var Parse = require('parse');

var Recipe = Parse.Object.extend("Recipe", {
  totalWieght: function(){}
});

var Ingredient = Parse.Object.extend("Ingredient");

module.exports = {
  'Recipe': Recipe,
  'Ingredient': Ingredient
};
