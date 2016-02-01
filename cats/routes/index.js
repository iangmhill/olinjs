var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Cat = require('../models/catModel.js');

var catNames = ['Fred','Bob','Steve','Pumpkin','Smokey','Gerald','Phil','Eliza',
    'Sam','Frank','Elizabeth','Wanda','Sarah','Lilac'];
var maxCatAge = 20;
var catColors = ['red','chocolate','cream','lilac','cinnamon','fawn','blue',
    'black','white','smoke'];

var hatTypes = ['Balmoral bonnet', 'baseball cap', 'beanie', 'beret', 'boater', 
    'bowler', 'deerstalker', 'dunce cap', 'fedora', 'fez', 'top hat'];
var hatColors = ['plad', 'black', 'grey', 'purple', 'maroon'];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function randomHat() {
  var type = hatTypes[randInt(0, hatTypes.length - 1)];
  var color = hatColors[randInt(0, hatColors.length - 1)];
  return {type: type, color: color};
}

function randomCat() {
  var name = catNames[randInt(0, catNames.length - 1)];
  var age = randInt(0, maxCatAge);
  var color = catColors[randInt(0, catColors.length - 1)];
  var hat = randomHat();
  return new Cat({name: name, age: age, color: color, hat: hat});
}

router.get('/', function(req, res, next){
  Cat.count({}, function(err, count) {
    res.render("home",{'count': count});
  });
});

// create new cat
router.get('/cats/new', function(req, res, next) {
  var newCat = randomCat();
  newCat.save(function (err) {
    if (err) {
      console.log("Problem saving newCat", err);
    }
  });
  Cat.count({}, function(err, count) {
    res.render('home', {
      'count': count,
      'action': 'New cat created',
      'cats': [newCat]
    });
  });
});

//get all cat names
router.get('/cats', function(req, res, next){
  Cat.find({},function(err, cats) {
    cats.sort(function(a,b) {
      return a.age > b.age;
    });
    Cat.count({}, function(err, count) {
      res.render('home', {
        'count': count,
        'action': 'Sorted list of cats',
        'cats': cats
      });
    });
  });
});

// create new cat named Bob
router.get('/cats/bycolor/:color', function(req, res, next) {
  Cat.find({color: req.params.color}, function(err, cats) {
    Cat.count({}, function(err, count) {
      res.render('home', {
        'count': count,
        'action': 'List of <' + req.params.color +'> colored cats',
        'cats': cats
      });
    });
  });
});

router.get('/cats/delete/old', function(req, res, next) {
  Cat.count({}, function(err, count) {
    if (count === 0) {
      res.render('home', {
        'count': 0,
        'action': 'Database empty. No cats to remove.',
        'cats': []
      });
      return;
    }

    Cat.find({},function(err, cats) {
      var maxAgeFound = 0;
      var deleteIndex;
      for (var i = 0; i < cats.length; i++) {
        if (cats[i].age >= maxAgeFound) {
          maxAgeFound = cats[i].age;
          deletedCat = cats[i];
        }
      }
      Cat.find({_id:deletedCat._id}).remove().exec();
      console.log(deletedCat);
      res.render('home', {
        'count': count-1,
        'action': 'Removed oldest cat',
        'cats': [deletedCat]
      });
    });
  });
});

router.get('/cats/black', function(req, res, next) {
  Cat.count({}, function(err, count) {
    Cat.find({$or: [
      {color: 'black'},
      {'hat.color': 'black'}
    ]},function(err, cats) {
      res.render('home', {
        'count': count,
        'action': 'All cats that are black or have black hats',
        'cats': cats
      });
    });
  });
});

module.exports = router;