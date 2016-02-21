// Setup our assertion library
var expect = require('chai').expect;

var index = require('../../routes/index');


// Sample tests
describe("A test suite", function() {
  // Synchronous
  it('should use expect syntax', function() {
    expect(false).not.to.be.true;
  });

  // Async
  it('should work asynchronously', function(done) {
    setTimeout(function() {
      expect(true).to.be.true;
      done();
    }, 1000);
  });
});