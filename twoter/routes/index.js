var express = require('express');
var mongoose = require('mongoose');
var Twote = require('../models/twoteModel.js');
var User = require('../models/userModel.js');

var routes = {
  main: function(req, res) {
    res.render('home', {

    });
  },
  login: function(req, res) {
    res.render('login', {

    });
  },
  signup: function(req, res) {
    res.render('signup', {

    });
  },
  getTwotes: function(req, res) {
    Twote.find(function(err, twotes) {
      res.send(twotes);
    });
  },
  getUsers: function(req, res) {
    User.find(function(err, users) {
      var usernamesOnly = [];
      for (var i = 0; i < users.length; i++) {
        usernamesOnly.push({username: users[i].username});
      }
      res.send(usernamesOnly);
    });
  },
  getUserInfo: function(req, res) {
    res.send({
      id: req.user._id,
      username: req.user.username
    });
  },
  createTwote: function(req, res) {
    User.findById(req.user._id, function (err, user) {
      if (err || !user) {
        res.status(404).send('Invalid user');
      }
      var newTwote = new Twote({
        userId: req.user._id,
        user: user.username,
        text: req.body.text
      });
      newTwote.save(function (err) {
        if (err) {
          res.status(404).send('Failed to save twote');
        }
        res.send({user: user.username, text: newTwote.text, id: newTwote._id});
      });
    })
  },
  deleteTwote: function(req, res) {
    console.log(req.body);
    Twote.findById(req.body.id, function (err, twote) {
      if (req.user.id == twote.userId) {
        twote.remove();
        res.send({id: twote._id});
      } else {
        res.status(400).send('Failed to delete twote');
      }
    });
  }
};

module.exports = routes;