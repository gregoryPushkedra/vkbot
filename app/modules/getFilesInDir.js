'use strict';

/**
 * Getting .js files from a dir, which export a function
 */

const fs = require('fs');
const path = require('path');

/**
 * @param  {String} dir
 * @return {Array}
 */
module.exports = dir => {
  let files = fs.readdirSync(dir);
  let output = [];

  for (let i = 0, len = files.length; i < len; i++) {
    let current = files[i];

    if (!current.endsWith('.js') || current === 'index.js') 
      continue;

    let filename = current.slice(0, -3);
    let file = require(path.join(dir, filename));

    if (typeof file === 'function') 
      output.push(file);
  }

  return output;
}