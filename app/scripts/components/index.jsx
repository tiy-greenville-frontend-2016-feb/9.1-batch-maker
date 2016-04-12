var React = require('react');
var ReactDOM = require('react-dom');
var LinkedStateMixin = require('react/lib/LinkedStateMixin');
var Input = require('react-bootstrap/lib/Input');
var ButtonInput = require('react-bootstrap/lib/ButtonInput');
var Parse = require('parse');
var ParseReact = require('parse-react');
var _ = require('underscore');

var models = require('../models');

// Setup parse
Parse.initialize("tiygvl");
Parse.serverURL = 'http://tiny-parse-server.herokuapp.com';

var IngredientFormset = React.createClass({
  render: function(){
    return (
      <div className="form-inline">
        <h3>Ingredient #{this.props.cid}</h3>
        <Input ref={"qty" + this.props.cid} type="text" name={"qty" + this.props.cid} placeholder="qty"/>
        <Input ref={"units" + this.props.cid} type="text" name={"units" + this.props.cid} placeholder="units"/>
        <Input ref={"name" + this.props.cid} type="text" name={"name" + this.props.cid} placeholder="name"/>
        <ButtonInput onClick={this.props.removeIngredient.bind(this, this.props.cid)} ref={"remove" + this.props.cid} className="btn-danger" value="Remove" />
      </div>
    )
  }
});


var AddRecipeView = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return {title: '', notes: '', ingredients: [], images: []};
  },
  componentWillMount: function(){
    var self = this;

    // Bail if no recipe id
    if(!self.props.recipeId){
      return;
    }

    var query = new Parse.Query('Recipe');
    query.get(self.props.recipeId, {
      success: function(recipe){
        self.setState({
          title: recipe.get('title'),
          notes: recipe.get('notes'),
          //ingredients: (new Parse.Query('Ingredient')).find()
        });
      }
    });
  },
  handleFile: function(event){
    console.log('handlefile');
    var file = event.target.files[0];
    var images = this.state.images;
    images.push(new Parse.File(file.name, file));
    this.setState({'images': images});
  },
  handleSubmit: function(event){
    event.preventDefault();
    var self = this;
    var router = this.props.router;
    var parseImages = this.state.images.map(function(image){
      image.save();
      return image;
    });

    var recipe = new models.Recipe();
    recipe.set({
      "title": this.state.title,
      "notes": this.state.notes,
      "images": parseImages
    });

    recipe.save(null, {
      success: function(recipe) {
        // Execute any logic that should take place after the object is saved.
        alert('New object created with objectId: ' + recipe.id);
        //var recipeIngredients = [];

        for(var i=1; i <= self.state.ingredients.length; i++){


          // Get ingredient formset values
          var ingredient = self.state.ingredients[i];
          console.log("formset: ", ingredient.cid, self.refs["formset"+ingredient.cid]);

          var qty = self.refs["formset"+ingredient.cid].refs["qty"+ingredient.cid].getInputDOMNode().value;
          var units = self.refs["formset"+ingredient.cid].refs["units"+ingredient.cid].getInputDOMNode().value;
          var name = self.refs["formset"+ingredient.cid].refs["name"+ingredient.cid].getInputDOMNode().value;

          // Setup parse object (model)

          ingredient.set('qty', parseInt(qty));
          ingredient.set('units', units);
          ingredient.set('name', name);
          ingredient.set('recipe', recipe);

          // Push parse obj to array for batch saving
          //recipeIngredients.push(ingredient);
        }

        console.log(self.state.ingredients);

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
    //var newCount = this.state.ingredientCount + 1;
    //this.setState({'ingredientCount': newCount});
    var ingredient = new models.Ingredient();
    this.state.ingredients.push(ingredient);
    this.forceUpdate();
  },
  removeIngredient: function(cid, event){
    event.preventDefault();

    var newIngredients = _.reject(this.state.ingredients, {'cid': cid});
    this.setState({'ingredients': newIngredients});
  },
  render: function(){

    var ingredientForms = this.state.ingredients.map(function(ingredient, count){
      return (<IngredientFormset key={ingredient.cid} cid={ingredient.cid} removeIngredient={this.removeIngredient} ref={"formset"+ingredient.cid}/>);
    }.bind(this));

    return (
      <form onSubmit={this.handleSubmit}>
        <Input type="text" label="Recipe Title" placeholder="Enter title" valueLink={this.linkState('title')} />
        <Input type="file" label="Image" onChange={this.handleFile}/>
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
  // mixins: [ParseReact.Mixin], // Enable query subscriptions
  //
  // observe: function() {
  //   // Subscribe to all Recipe objects, ordered by creation date
  //   // The results will be available at this.data.recipes
  //   return {
  //     recipes: (new Parse.Query('Recipe')).descending('createdAt')
  //   };
  // },
  getInitialState: function(){
    return {'recipes': []};
  },
  componentWillMount: function(){
    var self = this;
    var query = new Parse.Query('Recipe');

    query.find({
      success: function(recipes) {

        self.setState({'recipes': recipes});

        // alert("Successfully retrieved " + results.length + " scores.");
        // // Do something with the returned Parse.Object values
        // for (var i = 0; i < results.length; i++) {
        //   var object = results[i];
        //   alert(object.id + ' - ' + object.get('playerName'));
        // }
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    })
  },
  render: function(){

    var productRows = this.state.recipes.map(function(recipe){
      var imageUrl = recipe.get("images") ? recipe.get("images")[0].url(): '';
      return (
        <tr key={recipe.id}>
          <td><img src={imageUrl} width="40" height="40" /><br/>{recipe.get('title')}</td>
          <td>{recipe.get('notes')}</td>
          <td><a href={"#recipes/" + recipe.id + "/"}>Edit</a></td>
        </tr>
      )
    });

    return (
      <div>
        <div className="row">
          <div className="col-md-6"><h1>Recipes</h1></div>
          <div className="col-md-6">
            <a href="#recipes/add/" className="btn btn-primary">Add</a>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Price</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {productRows}
          </tbody>
        </table>
          {/*
          <ul>
            {this.data.recipes.map(function(recipe) {
              return <li key={recipe.id}>{recipe.title}:: {recipe.notes}</li>;
            })}
          </ul>
          */}
        </div>
      );
  }
});


module.exports = {
  AddRecipeView: AddRecipeView,
  RecipeListView: RecipeListView
};
