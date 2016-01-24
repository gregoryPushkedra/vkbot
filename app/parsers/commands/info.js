'use strict';

/**
 * Определяет вероятность события
 */
module.exports = (arg, callback) => {
  return callback('Вероятность -- ' + Math.floor(Math.random() * 101) + '%');
}