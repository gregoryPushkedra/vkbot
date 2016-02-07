'use strict';

const fs = require('fs');
const debug = require('../../modules/simple-debug');
const prequest = require('request-promise');
const parsers = require('./include/parsers');
const pathConfig = require('../config/config').path;

/**
 * Осуществляет поиск изображния в Google
 */
module.exports = (arg, callback) => {
  let argText = arg.fullText();
  let VK = arg.wholeObj()._vkapi;

  if (argText === null) 
    return callback(null);

  let reqUrl = 'https://google.ru/search?newwindow=1&site=imghp&tbm=isch&source=hp&q=' + encodeURIComponent(argText);
  let fileName = pathConfig['img'] + 'img_' + Date.now() + '.jpg';

  return prequest(reqUrl, {
    headers: {
      'User-Agent': 'SAMSUNG-SGH-E250/1.0 Profile/MIDP-2.0 Configuration/CLDC-1.1 UP.Browser/6.2.3.3.c.1.101 (GUI) MMP/2.0 (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)', 
      'Referer': 'https://www.google.ru/'
    }
  })
  .then(res => {
    if (!parsers.checkGoogleImgForExist(res)) 
      throw callback('Не найдено изображений по запросу <<' + argText + '>>');

    return res;
  })
  .then(res => parsers.parseGoogleImgUrl(res))
  .then(imgurl => {
    return (function download () {
      return prequest(imgurl(), { encoding: null }).catch(e => {
        if (e.error.code === 'ENOTFOUND') 
          return download();
      });
    })();
  })
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
  .catch(e => {
    if (e !== undefined) {
      debug('- Error in file "' + __filename + '"');
      debug(e);
    }
  });
}