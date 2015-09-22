/* eslint no-bitwise:0 */
'use strict';

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('graceful-fs'));

var WRITABLE = Math.pow(2, 0);
var READABLE = Math.pow(2, 2);
var GROUP_WRITABLE = Math.pow(2, 4);
var GROUP_READABLE = Math.pow(2, 5);
var USER_WRITABLE = Math.pow(2, 7);
var USER_READABLE = Math.pow(2, 8);

function userWritable(mode, uid) {
  return process.getuid() === uid && mode & USER_WRITABLE;
}

function groupWritable(mode, gid) {
  return process.getgid() === gid && mode & GROUP_WRITABLE;
}

function writable(mode) {
  return mode & WRITABLE;
}

function userReadable(mode, uid) {
  return process.getuid() === uid && mode & USER_READABLE;
}

function groupReadable(mode, gid) {
  return process.getgid() === gid && mode & GROUP_READABLE;
}

function readable(mode) {
  return mode & READABLE;
}

function isWritable(stat) {
  var mode = stat.mode;
  return Promise.resolve(userWritable(mode, stat.uid) ||
    groupWritable(mode, stat.gid) ||
    writable(mode));
}

function isReadable(stat) {
  var mode = stat.mode;
  return Promise.resolve(userReadable(mode, stat.uid) ||
    groupReadable(mode, stat.gid) ||
    readable(mode));
}

function getStat(filepath) {
  return fs.statAsync(filepath);
}

module.exports = function canWrite(filepath, checkReadability, done) {
  if (!arguments.length || typeof filepath !== 'string') {
    return Promise.reject(new Error('Invalid parameters'));
  }
  if (typeof checkReadability === 'function') {
    done = checkReadability;
    checkReadability = false;
  }

  return getStat(filepath)
    .then(function checkReadable(stat) {
      if (checkReadability) {
        return isReadable(stat)
          .then(function checkWritable(result) {
            if (result) {
              return isWritable(stat);
            }
            return result;
          });
      }
      return isWritable(stat);
    })
    .then(Boolean)
    .nodeify(done);
};
