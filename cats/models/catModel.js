var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// Consider an implementation where you have independent files for the two models Hat and Cat; i.e. hatModel.js and 
// catModel.js, respectively. You can reference the value of the hat key from the Cat model to be 
// { type: mongoose.Schema.Types.ObjectId, ref: 'hatModel' }. Therefore, you can link multiple schema files together
// and provide your code with nice modularity. Food for thought :)

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