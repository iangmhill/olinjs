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

    // You indicated that this was the segment you weren't sure about.
    // It all looks good to me! Comments are just nitpicks
    passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      // My understanding is that this function runs when a login happens --
      // so trying to find the user and creating one if they don't exist
      // makes perfect sense to me.
      User.findOne({ oauthID: profile.id }, function(err, user) {
        // pick one way of writing one-line ifs -- I don't mind which, but I'm a fan of consistency
        if (err) {
          return done(err, null); // I might specify null, just to make it explicitly clear that done takes two args
        }
        if (user != null) { // no need for the !err -- you already returned on the err case
          return done(null, user);
        }

        // You don't actually need the else -- returned in both of the if cases
        // Using returns like you did is a good way to avoid crazy-nested if/else blocks :)
        var user = new User({
          oauthID: profile.id,
          username: profile.displayName.replace(/ /g,"_")
        });

        user.save(function(err) {
          if (err) { // you had a space there before, so I'm putting one there here
            return done(err, null); // (again, my preference -- functionally no different, and completely up to you)
          } else {
            return done(null, user);
          };
        });
      });
    }
    ));

    return passport; // I'm not certain you need to do this -- but I'm quite probably wrong
  },
  checkAuthentication: function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.status(401).redirect('/login'); // great error handling!
  },
  signup: function(req, res, next) {
    passport.authenticate('local-signup', {
      successRedirect : '/',
      failureRedirect : '/signup'
    })(req, res, next);
  },
  deleteLocalUser: function(req, res) {
    User.find({ _id:req.user._id }).remove().exec();
    res.status(200).redirect('/login');
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
