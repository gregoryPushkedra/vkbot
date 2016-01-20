'use strict';

/**
 * Определяет вероятность события
 */
module.exports = (arg, callback) => {
  return callback({
    message: 'Вероятность -- ' + Math.floor(Math.random() * 101) + '%'
  });
}