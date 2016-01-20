'use strict';

const maxCount = require('../../config/commands/config').create.max;

/**
 * Создает беседу со случайными друзьями бота
 */
module.exports = (arg, callback) => {
  let count = parseInt(arg.firstWord());
      count = count <= maxCount ? count : maxCount;
  let mObj = arg.wholeObj();
  let VK = mObj._vkapi;
  let userId = mObj.fromId;

  return VK.call('execute.createRandomChat', { userId, count }).then(() => callback(null));
}