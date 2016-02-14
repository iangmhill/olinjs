var mongoose = require('mongoose');

var Ingredient = mongoose.Schema({
  name: String,
  price: Number,
  inStock: Boolean
});

module.exports = mongoose.model("ingredients", Ingredient);