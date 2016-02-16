var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User          = require('./models/userModel.js');
var passport      = require('passport');
var config        = require('./oauth');

var authentication = {
  configure: function() {
    passport.serializeUser(function(user, done) {
      console.log(user.id);
      done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
    passport.use('local-signup', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, username, password, done) {
      process.nextTick(function() {
        User.findOne({ 'username' :  username }, function(err, user) {
          if (err) { return done(err); }
          if (user) {
            return done(null, false);
          } else {
            var newUser = new User();
            newUser.username = username;
            newUser.password = newUser.generateHash(password);
            newUser.save(function(err) {
              if (err) { throw err; }
              return done(null, newUser);
            });
          }
        });    
      });
    }));
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
      console.log('HELLO!');
      User.findOne({ 'username' :  username }, function(err, user) {
        if (err) { return done(err); };
        if (!user) { return done(null, false); }
        if (!user.validPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }));

    passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ oauthID: profile.id }, function(err, user) {
        if (err) { return done(err); }
        if (!err && user != null) {
          return done(null, user);
        } else {
          var user = new User({
            oauthID: profile.id,
            username: profile.displayName.replace(/ /g,"_")
          });

          user.save(function(err) {
            if(err) {
              return done(err);
            } else {
              return done(null, user);
            };
          });
        };
      });
    }
    ));

    return passport;
  },
  checkAuthentication: function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  },
  signup: function(req, res, next) {
    passport.authenticate('local-signup', {
      successRedirect : '/',
      failureRedirect : '/signup'
    })(req, res, next);
  },
  login: function(req, res, next) {
    passport.authenticate('local-login', {
      successRedirect : '/',
      failureRedirect : '/login'
    })(req, res, next);
  },
  logout: function(req, res){
    req.logout();
    res.redirect('/login');
  },
  facebook: function(req, res, next) {
    passport.authenticate('facebook')(req, res, next);
  },
  facebookCallback: function(req, res, next) {
    passport.authenticate('facebook', {
      successRedirect:'/',
      failureRedirect: '/login'
    })(req, res, next);
  }
};

module.exports = authentication;