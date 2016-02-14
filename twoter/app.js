// TWOTER APP ==================================================================
// Author: Ian Hill
// Github: iangmhill
// Date: February 12, 2016


// MODULE IMPORTS ==============================================================
// utility modules
var path         = require('path');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');

// express modules
var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var exphbs       = require('express-handlebars');

// database modules
var mongoose     = require('mongoose');

// routes modules
var index = require('./routes/index');

// CONFIGURATION ===============================================================
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES ======================================================================
// GET requests
app.get('/home', index.home);
app.get('/login', index.login);
app.get('/api/getTwotes', index.getTwotes);

// POST requests
app.post('/api/createTwote', index.createTwote);

// CONNECT TO DATABASE =========================================================
mongoose.connect('mongodb://localhost/twoter');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error:'));

// START SERVER ================================================================
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Twoter running on port:", PORT);
});