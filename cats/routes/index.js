var express = require('express');
var router = express.Router();
var db = require('../fakeDatabase');
var catNames = ['Fred','Bob','Steve','Pumpkin','Smokey','Gerald','Phil','Eliza',
    'Sam','Frank','Elizabeth','Wanda','Sarah','Lilac'];
var maxCatAge = 20;
var catColors = ['red','chocolate','cream','lilac','cinnamon','fawn','blue',
    'black','white','smoke'];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function randomCat() {
  var name = catNames[randInt(0, catNames.length - 1)];
  var age = randInt(0, maxCatAge);
  var color = catColors[randInt(0, catColors.length - 1)];
  return Cat(name, age, color);
}

//function that constructs and returns cat object
function Cat(name, age, color){
  var cat = {
    name: name,
    age: age,
    color: color
  };
  return cat;
};

router.get('/', function(req, res, next){
  res.render("home",{});
});

// create new cat
router.get('/cats/new', function(req, res, next) {
  var newCat = randomCat();
  db.add(newCat);
  res.render('home', {
    'count': db.count(),
    'action': 'New cat created',
    'cats': [newCat]
  });
});

//get all cat names
router.get('/cats', function(req, res, next){
  var cats = db.getAll();
  cats.sort(function(a,b) {
    return a.age > b.age;
  });
  res.render('home', {
    'count': db.count(),
    'action': 'Sorted list of cats',
    'cats': cats
  });
});

// create new cat named Bob
router.get('/cats/bycolor/:color', function(req, res, next) {
  var cats = db.getAll();
  var catsFiltered = cats.filter(function(cat) {
    return cat.color === req.params.color;
  });
  res.render('home', {
    'count': db.count(),
    'action': 'List of <' + req.params.color +'> colored cats',
    'cats': catsFiltered
  });
});

router.get('/cats/delete/old', function(req, res, next) {
  if (db.count() === 0) {
    res.render('home', {
      'count': 0,
      'action': 'Database empty. No cats to remove.',
      'cats': []
    });
    return;
  }
  var cats = db.getAll();
  var maxAgeFound = 0;
  var deleteIndex = 0;
  for (var i = 0; i < cats.length; i++) {
    if (cats[i].age > maxAgeFound) {
      maxAgeFound = cats[i].age;
      deleteIndex = i;
    }
  }
  var deletedCat = db.remove(deleteIndex);
  res.render('home', {
    'count': db.count(),
    'action': 'Removed oldest cat',
    'cats': deletedCat
  });
});

module.exports = router;