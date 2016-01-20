'use strict';

const search = require('./__vk-search.js');

/**
 * Осущетвляет поиск видео по заданному запросу
 */
module.exports = (arg, callback) => {
  let argsArray = arg.textAndNum();
  let vkapi = arg.wholeObj()._vkapi;

  return search('video', callback, vkapi, ...argsArray);
}