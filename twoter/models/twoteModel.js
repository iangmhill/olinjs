var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Twote = mongoose.Schema({
  date: { type: Date, default: Date.now },
  text: String,
  userId: ObjectId,
  user: String
});

module.exports = mongoose.model("twotes", Twote);