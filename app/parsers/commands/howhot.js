'use strict';

const fs = require('fs');
const debug = require('../../modules/simple-debug');
const prequest = require('request-promise');
const pathConfig = require('../config/config').path;

/**
 * Определяет сексуальность человека
 */
module.exports = (arg, callback) => {
  let argPhoto = arg.attachment('photo');
  let VK = arg.wholeObj()._vkapi;

  if (argPhoto === null) 
    return callback(null);

  let howHotUrl = 'https://howhot.io/main.php';
  let fileName = pathConfig['howhot'] + 'howhot_' + Date.now() + '.jpg';

  return VK.call('messages.getById', { message_ids: argPhoto[1] })
    .then(mres => mres.items[0].attachments[0].photo.access_key)
    .then(key => VK.call('photos.getById', { photos: argPhoto[0] + '_' + key }))
    .then(res => prequest(res[0].photo_604, { encoding: null }))
    .then(imgbody => new Promise(resolve => fs.writeFile(fileName, imgbody, () => resolve(fileName))))
    .then(file => prequest.post(howHotUrl, { formData: { browseFile: fs.createReadStream(file) }, json: true }))
    .then(res => {
      try {
        fs.unlinkSync(fileName);
      } catch (e) {}

      if (res.success === true) {
        let rmes = res.message;
        let gender = { 'Female': '👩 Женщина', 'Male': '👨 Мужчина' };
        let message = gender[rmes.gender] + '\n\nВозраст: ' + rmes.age + '\nСексуальность: ' + parseFloat(rmes.hotness).toFixed(1) + '/10';

        return callback(message);
      } else {
        return callback('Не удалось обнаружить лицо на фото.');
      }
    })
    .catch(e => {
      if (e !== undefined) {
        debug('- Error in file "' + __filename + '"');
        debug(e);
      }
    });
}