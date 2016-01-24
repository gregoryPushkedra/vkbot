'use strict';

const cmdList = require('./commands/__list');
const argParser = require('./commands/include/arg-parsers');

module.exports = messageObj => {
  let message = messageObj.message;

  return {
    cond: /^\//.test(message), 
    fn: cb => {
      let _cmdList = cmdList(messageObj.isMultichat);
      let command = message.split(' ')[0].substr(1);
      let arg = argParser(messageObj);

      // command is not exist, nothing to do
      if (!~_cmdList.indexOf(command)) 
        return cb(null);

      // run command
      return require('./commands/' + command)(arg, r => {
        if (r === null) 
          return cb(null);

        return cb({
          message: typeof r === 'string' ? r : r.message, 
          attachments: r.attachments, 
          forward: messageObj.isMultichat
        });
      });
    }
  }
}