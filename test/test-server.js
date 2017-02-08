var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);


describe('index page', function() {
  it('exists', function(done) {
    chai.request(app)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
    });
  });
});

describe('create account page', function() {
  it('exists', function(done) {
    chai.request(app)
      .get('/create-account.html')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
    });
  });
});

describe('user home page', function() {
  it('exists', function(done) {
    chai.request(app)
      .get('/home.html')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
    });
  });
});

describe('profile page', function() {
  it('exists', function(done) {
    chai.request(app)
      .get('/profile.html')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
    });
  });
});