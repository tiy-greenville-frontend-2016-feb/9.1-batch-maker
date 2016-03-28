var Parse = require('parse');

var Recipe = Parse.Object.extend("Recipe", {
  totalWieght: function(){}
});

var Ingrediant = Parse.Object.extend("Ingrediant");

module.exports = {
  'Recipe': Recipe,
  'Ingrediant': Ingrediant
};
