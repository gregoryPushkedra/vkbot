'use strict';

const isCmdExist = require('./commands/__list').isExist;
const argParser = require('./commands/include/arg-parsers');

module.exports = messageObj => {
  let message = messageObj.message;

  return {
    cond: /^\//.test(message), 
    fn: cb => {
      let command = message.split(' ')[0].substr(1);
      let cmdName = isCmdExist(command, messageObj.isMultichat);
      let arg = argParser(messageObj);

      // command is not exist, nothing to do
      if (cmdName === false) 
        return cb(null);

      // run command
      return require('./commands/' + cmdName)(arg, r => {
        if (r === null) 
          return cb(null);

        return cb({
          message: typeof r === 'string' ? r : r.message, 
          attachments: r.attachments, 
          forward: r.forward !== undefined ? r.forward : messageObj.isMultichat
        });
      });
    }
  }
}