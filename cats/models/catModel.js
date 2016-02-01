var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Hat = mongoose.Schema({
  color: String,
  type: String
});

// Create Cat Schema
var Cat = mongoose.Schema({
  name: String,
  age: Number,
  color: String,
  hat: Hat
});

module.exports = mongoose.model("cats", Cat);