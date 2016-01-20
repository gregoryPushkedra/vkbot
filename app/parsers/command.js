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

      // will be called, when command applied successfully
      function afterComplete (cmdReturnedObj) {
        if (cmdReturnedObj === null) 
          return cb(null);

        return cb({
          message: cmdReturnedObj.message, 
          attachments: cmdReturnedObj.attachments, 
          forward: messageObj.isMultichat
        });
      }

      // command is not exist, nothing to do
      if (!~_cmdList.indexOf(command)) 
        return cb(null);

      // arg is null, show current command help
      if (arg === null) 
        return require('./commands/help')([command, _cmdList], afterComplete);

      // run command
      return require('./commands/' + command)(arg, afterComplete);
    }
  }
}