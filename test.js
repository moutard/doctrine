var request = require('supertest');
var assert  = require('assert');

describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('./server');
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
});
