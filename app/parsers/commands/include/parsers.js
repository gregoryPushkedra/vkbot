'use strict';

const cheerio = require('cheerio');
const qs = require('querystring');

module.exports = {
  checkGoogleImgForExist (rbody) {
    let $ = cheerio.load(rbody);

    if (~$('#topbar').next('div').text().indexOf('ничего не найдено')) 
      return false;

    return true;
  }, 

  parseGoogleImgUrl (rbody) {
    return new Promise((resolve, reject) => {
      let $ = cheerio.load(rbody);

      function getImageUrl () {
        let imageNumber = 0;

        return function () {
          return qs.parse($('#images').find('a.image').eq(imageNumber++).attr('href').split('?')[1]).imgurl;
        }
      }

      let imageUrl = getImageUrl();

      return resolve(imageUrl);
    });
  }, 

  parseStavKlassImgUrl (rbody) {
    return new Promise((resolve, reject) => {
      let $ = cheerio.load(rbody);
      let image = $('a.image');

      if (image.length === 0) 
        return reject(new Error('Не удалось спарсить изображение'));

      let imageUrl = image.eq(0).find('img').attr('src');

      return resolve(imageUrl);
    });
  }
}