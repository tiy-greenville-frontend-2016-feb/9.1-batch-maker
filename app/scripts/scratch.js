
// Example of returning early
handleSubmit: function(){

  // If user not logged in, force login
  if(! Parse.User.current()){
    this.props.router.navigate('signin', {trigger: true});
    return;
  }

  //set the author's id to the recipeObj since it was not held by the form
  recipeObj.authorId = this.state.user.id;
  recipeObj.authorName = this.state.user.get('firstname')
                        + ' ' + this.state.user.get('lastname');

  //define our constructors for the classes included in a recipe
  var Recipe = Parse.Object.extend("Recipe");
  var Step = Parse.Object.extend("Step");
  var Ingredient = Parse.Object.extend("Ingredient");

}



// Example mounting to multiple nodes

ReactDOM.render(
  React.createElement(NavComponent),
  document.getElementById('sidebar')
);

ReactDOM.render(
  React.createElement(HeaderComponent),
  document.getElementById('header')
);
