'use strict';

const cmdList = require('./__list');
const lang = require('../../config/commands/lang').help;
const aliases = require('./__aliases');

function availabeCommands (isMchat) {
  let cmdL = cmdList.list(isMchat, true);

  return '▶ /' + cmdL.map(v => v + ' ' + lang[v][1]).join('\n▶ /');
}

/**
 * Вывод помощи по использованию бота
 */
module.exports = (arg, callback) => {
  let isMultichat = arg.wholeObj().isMultichat;
  let cmd = arg.firstWord() || 'help';
  let cmdName = cmdList.isExist(cmd, isMultichat);

  if (cmdName === false) 
    return callback(null);

  let helpText = cmdName === 'help' ? lang['help'][0](availabeCommands(isMultichat)) : ('▶ /' + (cmd + ' ' + lang[cmdName][1]) + '\n\n' + lang[cmdName][0] + '\n\n' + 'Псевдонимы команды: /' + cmdName + ', /' + aliases[cmdName].join(', /'));

  return callback(helpText);
}