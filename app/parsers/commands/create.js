'use strict';

const createCfg = require('../../config/commands/config').create;

/**
 * Creates a multichat with Bot's friends
 */
module.exports = (arg, callback) => {
  let count = parseInt(arg.firstWord() || createCfg.default);
      count = count <= createCfg.max ? count : createCfg.max;
  let mObj = arg.wholeObj();
  let VK = mObj._vkapi;
  let userId = mObj.fromId;

  return VK.call('execute.createRandomChat', { userId, count }).then(() => callback(null));
}