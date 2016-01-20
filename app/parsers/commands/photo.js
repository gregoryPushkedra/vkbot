'use strict';

const search = require('./__vk-search.js');

/**
 * Поиск фотографии во ВКонтакте по запросу
 */
module.exports = (arg, callback) => {
  let argsArray = arg.textAndNum();
  let vkapi = arg.wholeObj()._vkapi;

  return search('photo', callback, vkapi, ...argsArray);
}