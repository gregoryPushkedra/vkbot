'use strict';

const fs = require('fs');
const joinMp3 = require('../../modules/tts-join-mp3');
const prequest = require('request-promise');
const pathConfig = require('../../config/commands/config').path;

/**
 * Озвучивание текста и заливка аудиозаписи во ВКонтакте
 */
module.exports = (arg, callback) => {
  let argText = arg.fullText();
  let VK = arg.wholeObj()._vkapi;

  if (argText === null) 
    return callback(null);

  // Убираем озвучку перевода на новую строку и обрезаем текст
  argText = argText.replace(/<br>/g, ',').substr(0, 1500);

  let reqUrl = 'https://tts.voicetech.yandex.net/tts?text='+ encodeURIComponent(argText) +'&lang=ru_RU&format=mp3&quality=hi&platform=web&application=translate';
  let fileName = pathConfig['tts'] + 'tts_' + Date.now() + '.mp3';

  function saveAudio (newTtsFileName) {
    return VK.upload('audio', fs.createReadStream(newTtsFileName))
      .then(res => {
        try {
          fs.unlinkSync(fileName);
          fs.unlinkSync(newTtsFileName);
        } catch (e) {}

        return callback({
          attachments: 'audio' + res.owner_id + '_' + res.id
        });
      });
  }

  return prequest(reqUrl).pipe(fs.createWriteStream(fileName))
    .on('close', () => joinMp3(fileName, newFileName => saveAudio(newFileName)));
}