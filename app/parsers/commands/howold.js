'use strict';

const debug = require('../../modules/simple-debug');
const prequest = require('request-promise');
const facesToText = require('../../other/helpers').facesToText;

/**
 * Определяет сколько лет человеку на фото.
 */
module.exports = (arg, callback) => {
  let argPhoto = arg.attachment('photo');
  let VK = arg.wholeObj()._vkapi;

  let howOldUrl = 'https://how-old.net/Home/Analyze?isTest=false';

  return VK.call('messages.getById', { message_ids: argPhoto[1] })
    .then(mres => mres.items[0].attachments[0].photo.access_key)
    .then(key => VK.call('photos.getById', { photos: argPhoto[0] + '_' + key }))
    .then(res => prequest(res[0].photo_604, { encoding: null }))
    .then(buffer => prequest.post(howOldUrl, { headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': buffer.length }, body: buffer }))
    .then(res => callback({ message: facesToText(res) }))
    .catch(e => {
      // try to send data again when error was catched
      debug('- Error in file "' + __filename + '". Trying to resend data.');
      debug(e);

      return module.exports(arg, callback);
    });
}