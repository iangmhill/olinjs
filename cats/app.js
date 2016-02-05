var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

var express = require('express');
var index = require('./routes/index');
var app = express();

var mongoose = require('mongoose');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// I generally like to handle all type of requests in my app.js and have methods exported from a module like index
// instead of "using" it. Find my in class and I can explain what I mean by that, I think you are going to like it :)
app.use('/', index);

mongoose.connect('mongodb://localhost/cats');
var db = mongoose.connection;

// Not nessecary but interesting to have just to verify your connection to the db is actually there. You can
// further implement something like the following, which handles the potential existance of a environment
// variable that links to a remotely hosted server|port.

// var PORT = process.env.PORT || 3000;

// app.listen(PORT, function() {
//   console.log("Application running on port:", PORT);
// });

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.listen(3000);
});