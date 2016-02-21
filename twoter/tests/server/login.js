var superagent = require('superagent');
var agent = superagent.agent();
var credentials = {
  username: "test",
  password: "test"
};

exports.login = function (request, done) {
  request
    .post('/login')
    .send(credentials)
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      agent.saveCookies(res);
      done(agent);
    });
};