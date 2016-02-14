var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Order = mongoose.Schema({
  name: String,
  ingredients: [ObjectId],
  price: Number,
  complete: Boolean
});

module.exports = mongoose.model("orders", Order);