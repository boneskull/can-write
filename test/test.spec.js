'use strict';

var canWrite = require('../lib');
var Promise = require('bluebird');
var tmp = Promise.promisifyAll(require('tmp'));

tmp.setGracefulCleanup();

describe('can-write', function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create('can-write');
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should be a function', function() {
    expect(canWrite).to.be.a('function');
  });

  it('should be rejected if not passed a filepath', function() {
    return expect(canWrite()).to.eventually.be.rejectedWith(Error);
  });

  it('should be rejected if passed a non-string filepath', function() {
    return expect(canWrite(false)).to.eventually.be.rejectedWith(Error);
  });

  it('should resolve if it could check writability', function() {
    return expect(canWrite(__filename)).to.eventually.be.resolved;
  });

  describe('when checking a file', function() {
    it('should resolve w/ true if it finds writability', function() {
      return tmp.fileAsync()
        .then(function(info) {
          return expect(canWrite(info)).to.eventually.equal(true);
        });
    });

    it('should resolve w/ false if it does not find writability', function() {
      return tmp.fileAsync()
        .then(function(info) {
          sandbox.stub(process, 'getuid').returns(0);
          return info;
        })
        .then(function(info) {
          return expect(canWrite(info)).to.eventually.equal(false);
        });
    });

    it('should resolve w/ true if it also finds readability', function() {
      return tmp.fileAsync()
        .then(function(info) {
          return expect(canWrite(info, true)).to.eventually.equal(true);
        });
    });

    it('should resolve w/ false if it does not also find readability',
      function() {
        return tmp.fileAsync()
          .then(function(info) {
            sandbox.stub(process, 'getuid').returns(0);
            return info;
          })
          .then(function(info) {
            return expect(canWrite(info, true)).to.eventually.equal(false);
          });
      });
  });

  describe('when checking a directory', function() {
    it('should resolve w/ true if it finds writability', function() {
      return tmp.dirAsync()
        .then(function(info) {
          return expect(canWrite(info)).to.eventually.equal(true);
        });
    });

    it('should resolve w/ false if it does not find writability', function() {
      return tmp.dirAsync()
        .then(function(info) {
          sandbox.stub(process, 'getuid').returns(0);
          return info;
        })
        .then(function(info) {
          return expect(canWrite(info)).to.eventually.equal(false);
        });
    });

    it('should resolve w/ true if it also finds readability', function() {
      return tmp.dirAsync()
        .then(function(info) {
          return expect(canWrite(info, true)).to.eventually.equal(true);
        });
    });

    it('should resolve w/ false if it does not also find readability',
      function() {
        return tmp.dirAsync()
          .then(function(info) {
            sandbox.stub(process, 'getuid').returns(0);
            return info;
          })
          .then(function(info) {
            return expect(canWrite(info, true)).to.eventually.equal(false);
          });
      });
  });

  describe('when passed a NodeJS-style callback', function() {
    it('should work properly', function(done) {
      canWrite(__filename, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.exist;
        done();
      });
    });

    it('should work properly with readability parameter', function(done) {
      canWrite(__filename, true, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.exist;
        done();
      });
    });
  });
});
