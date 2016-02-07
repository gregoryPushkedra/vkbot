'use strict';

const searchConfig = require('../config/config').search;

/**
 * Searches video/audio/photo on VK.COM
 */
module.exports = (type, callback, VK, q, count) => {
  let typeObj = searchConfig[type];

  if (!q) 
    return callback(null);

  count = parseInt(count || 1);
  count = count <= typeObj.max ? count : typeObj.max;

  let params = Object.assign({ q, count }, typeObj.params);

  return VK.call(typeObj.label + '.search', params).then(res => {
    let attachItems = [];

    if (res.count == 0 || res.items.length === 0) 
      return callback(typeObj.text + ' по запросу <<' + q + '>> не найдены.');

    res.items.forEach(itemObj => attachItems.push(typeObj.attach + itemObj.owner_id + '_' + itemObj.id));

    return callback({
      attachments: attachItems.join(',')
    });
  });
}