'use strict';

const search = require('./__vk-search.js');

/**
 * Осущетвляет поиск музыки по заданному запросу
 */
module.exports = (arg, callback) => {
  let argsArray = arg.textAndNum();
  let vkapi = arg.wholeObj()._vkapi;

  return search('music', callback, vkapi, ...argsArray);
}