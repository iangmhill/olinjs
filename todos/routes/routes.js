var express = require('express');
var mongoose = require('mongoose');
var Todo = require('../models/todoModel');

var routes = {
  getTodos: function(req, res) {
    Todo.find(function(err, todos) {
      if (err) {
        console.log("ERROR: Cannot retrieve todos")
        res.json([]);
      }
      res.status(200).json(todos);
    });
  },
  createTodo: function(req, res) {
    var description = req.body.description;
    var todo = new Todo({
      description: description
    });
    todo.save(function(err) {
      if (err) {
        return res.send({
          success: false,
          message: 'ERROR: Could not save todo'
        });
      }
      return res.send({
        success: true,
        created: todo.created.toString().substring(0,24),
        completed: todo.completed,
        description: todo.description,
        _id: todo._id
      });
    });
  },
  deleteTodo: function(req, res) {
    Todo.findById(req.body.id).remove(function (err) {
      if (err) {
        return res.send({
          success: false,
          message: 'ERROR: Could not save todo'
        });
      }
      return res.send({
        success: true
      });
    });
  },
  editTodo: function(req, res) {
    var id = req.body.id;
    var completed = req.body.completed;
    var description = req.body.description;
    Todo.findById(id, function(err, todo) {
      todo.completed = completed;
      todo.description = description;
      todo.save(function(err) {
        if (err) {
          return res.send({
            success: false,
            message: 'ERROR: Could not save todo'
          });
        }
        return res.send({
          success: true,
          created: todo.created.toString().substring(0,24),
          completed: todo.completed,
          description: todo.description
        });
      });
    });
  }
}

module.exports = routes;