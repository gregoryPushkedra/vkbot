'use strict';

const cmdList = require('./__list');
const lang = require('../../config/commands/lang').help;

function availabeCommands (cmdL) {
  return '▶ /' + cmdL.map(v => v + ' ' + lang[v][1]).join('\n▶ /');
}

/**
 * Вывод помощи по использованию бота
 */
module.exports = (arg, callback) => {
  let _cmdList = cmdList(arg.wholeObj().isMultichat);
  let cmd = arg.firstWord() || 'help';

  if (!~_cmdList.indexOf(cmd)) 
    return callback(null);

  let helpText = cmd === 'help' ? lang['help'][0](availabeCommands(_cmdList)) : ('▶ /' + (cmd + ' ' + lang[cmd][1]) + '\n\n' + lang[cmd][0]);

  return callback(helpText);
}