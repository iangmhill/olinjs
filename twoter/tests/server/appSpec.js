var app = require('./../../app.js');
var request = require('supertest')(app);
var credentials = {
  "username": "test",
  "password": "test"
};
var twoteId;
describe('TWOTER TESTS', function() {
  describe('USER NOT AUTHENTICATED', function() {
    it('should return 302 direction on GET / when not authenticated', function(done) {
      request
        .get('/')
        .expect(302, done);
    });
    it('should be able to create user on signup page', function(done) {
      request
        .post('/signup')
        .send(credentials)
        .expect(302, done);
    });
    it('should return 200 OK on GET /login', function(done) {
      request
        .get('/login')
        .expect(200, done);
    });
    it('should return 200 OK on GET /signup', function(done) {
      request
        .get('/signup')
        .expect(200, done);
    });
  });

  describe('USER AUTHENTICATED', function() {
    var agent;

    before(function (done) {
      require('./login').login(request, function (loginAgent) {
        agent = loginAgent;
        done();
      });
    });

    it('should return 200 on GET / when authenticated', function (done) {
      var req = request.get('/');
      agent.attachCookies(req);
      req.expect(200, done);
    });

    it('should be able to create a test twote when logged in', function(done) {
      var req = request.post('/api/createTwote');
      agent.attachCookies(req);
      req.send({text: 'test twote'}).expect(function(res) {
          twoteId = res.body.id;
        }).expect(200,done);
    });

    it('should return 200 and JSON on GET /api/getTwotes', function (done) {
      var req = request.get('/api/getTwotes');
      agent.attachCookies(req);
      req
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8', done);
    });

    it('should return 200 and JSON on GET /api/getUsers', function (done) {
      var req = request.get('/api/getUsers');
      agent.attachCookies(req);
      req
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8', done);
    });
    
    it('should be able to delete the test twote when logged in', function(done) {
      console.log('AAA' + twoteId);
      var req = request.post('/api/deleteTwote');
      agent.attachCookies(req);
      req.send({id: twoteId}).expect(200,done);
    });

    it('should return 302 FOUND and delete currently logged in local user', function(done) {
      var req = request.post('/api/deleteLocalUser');
      agent.attachCookies(req);
      req.expect(302, done);
    });
  });
});

// describe('Twoter', function() {




//   it('should be able to login', function(done) {
//     request(app)
//       .post('/login', {username: 'test', password: 'test'})
//       .expect(302, done);
//   });

//   it('should return 200 on GET / when authenticated', function(done) {
//     request(app)
//       .get('/')
//       .expect(200)
//       .end(function(err, res) {

//         done();
//       });
//   });




//   // What other routes can you test?

//   it('should return 404 on GET /notaroute', function(done) {
//     request(app)
//       .get('/notaroute')
//       .expect(404, done);
//   });
// });