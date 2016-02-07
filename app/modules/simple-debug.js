'use strict';

/**
 * Simple debug logs
 */

module.exports = (text, cyan) => {
  let textColor = cyan ? 36 : 33; // cyan/yellow

  if (process.env.DEBUG) 
    return console.log('\x1b[32m[' + (new Date).toTimeString().split(' ')[0] + ']\x1b[0m\x1b[' + textColor + 'm', text, '\x1b[0m');
}