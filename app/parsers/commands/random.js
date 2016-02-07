'use strict';

const randomConfig = require('../config/config').random;

function randomInteger (arrFromTo) {
  let min = parseInt(arrFromTo[0]);
  let max = parseInt(arrFromTo[1]);

  return Math.floor(min + Math.random() * (max + 1 - min));
}

/**
 * Возвращает случайное число
 */
module.exports = (arg, callback) => {
  let argFirst = arg.firstWord();
  let defaultFromTo = randomConfig.default.split('-');
  let fromTo = [];

  if (arg.isNull) {
    fromTo = defaultFromTo;
  } else if (~argFirst.indexOf('-')) {
    fromTo = argFirst.split('-');
  } else {
    fromTo = [0, argFirst];
  }

  fromTo.forEach((v, i) => {
    if (isNaN(parseInt(v))) 
      fromTo[i] = defaultFromTo[i];
  });

  return callback(`Случайное число: ${randomInteger(fromTo)}`);
}