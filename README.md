# can-write [![Build Status](https://travis-ci.org/boneskull/can-write.svg?branch=master)](https://travis-ci.org/boneskull/can-write)

> Test if a file or directory is writable.  Because sometimes you just gotta know. 

## Usage

```js
var canWrite = require('can-write');

return canWrite('/path/to/my/file')
  .then(function(result) {
    if (result) {
      // writable
    } else {
      // not writable
    }
  }, function(err) {
    // some sort of error
  });
  
// alternatively:
  
canWrite('/path/to/my/file', function(err, result) {
  if (err) {
    // handle error 
  } else {
    if (result) {
    // writable
    } else {
      // not writable
    }
  }
});
```

### Readability

Writability does not always imply readability.  Think a "Drop Box", wherein guest users can put files in, but cannot read the contents.
 
To check readability, pass a truthy second parameter:
  
```js
var canWrite = require('can-write');

return canWrite('/path/to/my/file', true)
  .then(function(result) {
    if (result) {
      // readable & writable
    } else {
      // either not readable or not writable.
      // if you need to know, call canWrite() again without the flag.
    }
  }, function(err) {
    // some sort of error
  });
```

## Fair Warning

It's an *anti-pattern* to check writability.

You generally want to just **do what you're going to do**, then recover from an error.

For example, say you need to create a file:

```js
fs.writeFile('/some/filepath', 'some data', function(err) {
  if (err.code === 'EACCESS') {
    // the file is not writable.
  }
});
```

In other words: don't use this module unless you really, *really*, ***really*** need to check whether something is writable.

## Install

```shell
$ npm install can-write
```

## License

© 2015 [Christopher Hiller](https://boneskull.com).  Licensed MIT.
