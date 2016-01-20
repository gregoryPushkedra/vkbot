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
  let _cmdList;
  let cmd;

  if (Array.isArray(arg)) {
    cmd = arg[0];
    _cmdList = arg[1];
  } else {
    cmd = arg.firstWord();
    _cmdList = cmdList(arg.wholeObj().isMultichat);
  }

  if (!~_cmdList.indexOf(cmd)) 
    return callback(null);

  let helpText = cmd === 'help' ? lang['help'][0](availabeCommands(_cmdList)) : ('▶ /' + (cmd + ' ' + lang[cmd][1]) + '\n\n' + lang[cmd][0]);

  return callback({
    message: helpText
  });
}