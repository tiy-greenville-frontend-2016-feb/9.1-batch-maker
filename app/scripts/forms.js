var forms = require('newforms');

var IngredientForm = forms.Form.extend({
  qty: forms.CharField(),
  unit: forms.CharField(),
  name: forms.CharField()
});

var IngredientFormSet = forms.FormSet.extend({form: IngredientForm, extra: 2});

module.exports = {
  'IngredientForm': IngredientForm,
  'IngredientFormSet': IngredientFormSet
};
