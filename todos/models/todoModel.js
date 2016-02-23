// models/todoModel.js
var mongoose = require('mongoose');

var Todo = mongoose.Schema({
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  description: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: new Date()
  }
});

module.exports = mongoose.model("todos", Todo);