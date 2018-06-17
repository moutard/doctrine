var request = require('supertest');
var assert  = require('assert');

describe('Read only calls', function () {
  var server;
  beforeEach(function () {
    server = require('./server');
    server.reset();

  });
  afterEach(function () {
    server.close();
  });
  it('responds to /', function testSlash(done) {
  request(server)
    .get('/')
    .expect(200, done);
  });
  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
  it('get ingredients', function testPath(done) {
    request(server)
      .get('/ingredients')
      .expect(200, done);
  });
  it('get potions', function testPath(done) {
    request(server)
      .get('/potions')
      .expect(200, done);
  });
  it('get users', function testPath(done) {
    request(server)
      .get('/users')
      .expect(200, done);
  });
  it('get user with id', function testPath(done) {
    request(server)
      .get('/users/12')
      .expect(200, done);
  });
  it('get user with unknown id', function testPath(done) {
    request(server)
      .get('/users/1')
      .expect(404, done);
  });

  it('consume ingredients id that are not in your inventory', function testPath(done) {
    request(server)
      .put('/users/12/consume/1-2-3')
      .expect(403, done);
  });

  it('consume ingredients id that you have in your inventory too many times', function testPath(done) {
    request(server)
      .put('/users/12/consume/3-3-3')
      .expect(403, done);
  });

  it('consume ingredients that are in your inventory', function testPath(done) {
    request(server)
      .put('/users/12/consume/3-6-9')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        assert.equal(res.body.id, 12);
        assert.equal(res.body.inventory.length, 2);
      });
      request(server).get('/users/12')
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          assert.equal(res.body.id, 12);
          assert.equal(res.body.inventory.length, 2);
          done();
        });
  });

  it('mix ingredients id that are not in your inventory', function testPath(done) {
    request(server)
      .put('/users/12/mix/1-2-3')
      .expect(403, done);
  });

  it('mix not enough ingredients', function testPath(done) {
    request(server)
      .put('/users/12/mix/3-6')
      .expect(403)
      .end(function(err, res) {
        assert.equal(res.body.Error, "You have to use 3 ingredients to make a potion.");
      });

      // Rq: This will remove them from the inventory.
      request(server).get('/users/12')
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          assert.equal(res.body.id, 12);
          assert.equal(res.body.inventory.length, 2);
          done();
        });
  });

  it('mix a valid potion', function testPath(done) {
    request(server)
      .put('/users/12/mix/3-6-9')
      .expect(200)
      .end(function(err, res) {
        assert.equal(res.body.Message, "Great you just aquired Potion de vie");
      });

      // Rq: This will remove them from the inventory.
      request(server).get('/users/12')
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          assert.equal(res.body.id, 12);
          assert.equal(res.body.inventory.length, 2);
          done();
        });
  });
});
