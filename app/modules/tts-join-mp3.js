'use strict';

/**
 * Join two mp3 files (tts + blank mp3 file) in new one for /tts command
 */

const fs = require('fs');
const path = require('path');

const pathConfig = require('../config/commands/config').path;

let newFile;
let newFileName;

function joinMp3Files (path1, callback) {
  if (path1 === false) {
    let stream = fs.createReadStream(pathConfig['ttsEmpty']);
        stream.pipe(newFile);

    return stream.on('end', () => callback(newFileName));
  }

  let stream = fs.createReadStream(path1);
      stream.pipe(newFile, { end: false });
      stream.on('end', () => joinMp3Files(false, callback));
}

module.exports = (path1, callback) => {
  newFileName = path.join(pathConfig['tts'], 'newTtsFile_' + Date.now() + '.mp3');
  newFile = fs.createWriteStream(newFileName);

  joinMp3Files(path1, callback);
}