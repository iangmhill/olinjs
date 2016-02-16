// TWOTER APP ==================================================================
// Author: Ian Hill
// Github: iangmhill
// Date: February 12, 2016


// MODULE IMPORTS ==============================================================
// utility modules
var path           = require('path');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');

// express modules
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var exphbs         = require('express-handlebars');
var session        = require('express-session');

// database modules
var mongoose       = require('mongoose');

// routes modules
var routes         = require('./routes/index');

// authentication modules
var authentication = require('./authentication.js');

// CONFIGURATION ===============================================================

var passport = authentication.configure();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'twoter', resave: true, saveUninitialized: false })); // session secret
app.use(passport.initialize());
app.use(passport.session());

// ROUTES ======================================================================
// GET requests
app.get('/', authentication.checkAuthentication, routes.main);
app.get('/login', routes.login);
app.get('/signup', routes.signup);
app.get('/api/getTwotes', routes.getTwotes);
app.get('/api/getUsers', routes.getUsers);
app.get('/api/getUserInfo', routes.getUserInfo);
app.get('/logout', authentication.logout);
app.get('/auth/facebook', authentication.facebook);
app.get('/auth/facebook/callback', authentication.facebookCallback);

// POST requests
app.post('/login', authentication.login);
app.post('/signup', authentication.signup);
app.post('/api/createTwote', routes.createTwote);
app.post('/api/deleteTwote', routes.deleteTwote);

// CONNECT TO DATABASE =========================================================
mongoose.connect('mongodb://localhost/twoter');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error:'));

// START SERVER ================================================================
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Twoter running on port:", PORT);
});