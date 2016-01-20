'use strict';

const fs = require('fs');
const path = require('path');

module.exports = [];

fs.readdirSync(__dirname)
  .filter(v => v.endsWith('.js') && v !== 'index.js')
  .forEach(v => {
    let filename = v.slice(0, -3);

    module.exports.push(require(path.join(__dirname, filename)));
  });

module.exports = module.exports.filter(v => typeof v === 'function');