'use strict';

module.exports = text => {
  if (process.env.DEBUG) 
    return console.log('\x1b[32m[' + (new Date).toTimeString().split(' ')[0] + ']\x1b[0m\x1b[33m', text, '\x1b[0m');
}