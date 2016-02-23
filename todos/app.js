
// MODULE IMPORTS ==============================================================

// utility modules
var path           = require('path');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');

// express modules
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');

// database modules
var mongoose       = require('mongoose');

// route modules
var routes         = require('./routes/routes');

// CONFIGURATION ===============================================================
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CONNECT TO DATABASE =========================================================
mongoose.connect('mongodb://localhost/todos');

// ROUTES ======================================================================

// GET requests
app.get('/api/getTodos', routes.getTodos);

// POST requests
app.post('/api/createTodo', routes.createTodo);
app.post('/api/deleteTodo', routes.deleteTodo);
app.post('/api/editTodo', routes.editTodo);

// AngularJS requests
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// START SERVER ================================================================
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Todos running on port:", PORT);
});