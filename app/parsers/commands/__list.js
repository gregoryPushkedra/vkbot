'use strict';

const fs = require('fs');
const path = require('path');

const aliases = require('./__aliases');

function cmdList (isMchat, lite) {
  let onlyForMultichat = ['goaway', 'who', 'invite']; // только для бесед
  let onlyForPersonal = ['create', 'addme']; // только для ЛС

  let rlist = {};

  let list = fs.readdirSync(__dirname)
    .filter(v => v.endsWith('.js') && !v.startsWith('__'))
    .map(v => v.slice(0, -3))
    .filter(v => (!isMchat ? !~onlyForMultichat.indexOf(v) : !~onlyForPersonal.indexOf(v)));

  if (lite === true) 
    return list;

  list.forEach(v => {
    rlist[v] = aliases[v] || [];
  });

  return rlist;
}

/**
 * If command exists, function will return its name
 */
function isExist (command, isMchat) {
  let list = cmdList(isMchat);

  for (let key in list) {
    if (key === command || ~list[key].indexOf(command)) 
      return key;
  }

  return false;
}

module.exports = { 
  list: cmdList, 
  isExist
}
