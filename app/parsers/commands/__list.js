'use strict';

const fs = require('fs');
const path = require('path');

const aliases = require('./__aliases');

function cmdList (isMchat, lite) {
  let onlyForMultichat = ['goaway', 'who', 'invite']; // only for multichats
  let onlyForPersonal = ['create', 'addme']; // only for personal messages

  // array of filtered commands
  let list = fs.readdirSync(__dirname)
    .filter(v => v.endsWith('.js') && !v.startsWith('__'))
    .map(v => v.slice(0, -3))
    .filter(v => (!isMchat ? !~onlyForMultichat.indexOf(v) : !~onlyForPersonal.indexOf(v)));

  if (lite === true) 
    return list;

  // obj of commands with their aliases
  let rlist = {};

  list.forEach(v => {
    rlist[v] = aliases[v] || [];
  });

  return rlist;
}

/**
 * If command exists, function will return its name, else => false
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
