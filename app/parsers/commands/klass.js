'use strict';

const fs = require('fs');
const prequest = require('request-promise');
const parsers = require('./include/parsers');
const pathConfig = require('../config/config').path;

/**
 * Ищет и возвращает мемчик с сайта stavklass.ru по запросу
 */
module.exports = (arg, callback) => {
  let argText = arg.fullText() || 'random';
  let VK = arg.wholeObj()._vkapi;

  let reqUrl = 'http://stavklass.ru/images/search?image[text]=' + encodeURIComponent(argText);
  let randomUrl = 'http://stavklass.ru/images/random.jpg?n=' + Date.now();

  let fileName = pathConfig['klass'] + 'klass_' + Date.now() + '.jpg';
  let isRandom = argText === 'random';

  reqUrl = isRandom ? randomUrl : reqUrl;

  return prequest(reqUrl, { encoding: isRandom ? null : 'utf8' })
        .then(res => isRandom ? res : parsers.parseStavKlassImgUrl(res))
        .then(imgurl => isRandom ? imgurl : prequest(imgurl, { encoding: null }))
        .then(imgbody => new Promise(resolve => fs.writeFile(fileName, imgbody, () => resolve(fileName))))
        .then(file => VK.upload('photo_pm', fs.createReadStream(file)))
        .then(res => {
          try {
            fs.unlinkSync(fileName);
          } catch (e) {}

          return callback({
            attachments: 'photo' + res[0].owner_id + '_' + res[0].id
          });
        })
        .catch(err => {
          if (err !== undefined && err.statusCode == '500') {
            return callback('По запросу <<' + argText + '>> ничего не найдено.');
          }
        });
}