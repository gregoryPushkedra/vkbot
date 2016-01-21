'use strict';

const fs = require('fs');
const path = require('path');

function cmdList (isMchat) {
  let onlyForMultichat = ['goaway', 'who', 'invite']; // только для бесед
  let onlyForPersonal = ['create']; // только для ЛС

  return fs.readdirSync(__dirname)
    .filter(v => v.endsWith('.js') && !v.startsWith('__'))
    .map(v => v.slice(0, -3))
    .filter(v => (!isMchat ? !~onlyForMultichat.indexOf(v) : !~onlyForPersonal.indexOf(v)));
}

module.exports = cmdList;
