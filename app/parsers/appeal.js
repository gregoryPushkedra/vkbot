'use strict';

const config = require('../config/config');

module.exports = function (messageObj) {
  let isM = messageObj.isMultichat;
  let msg = messageObj.message;

  return {
    cond: isM ? config.bot.pattern.test(msg) : !msg.startsWith('/'), 
    fn: cb => {
      let message = msg.substr(isM ? 4 : 0).trim();

      return messageObj._cleverbot.write(message)
        .then(ans => {
          let retObj;

          if (ans.length > 0) {
            retObj = {
              message: ans,
              forward: isM ? true : false
            }
          } else {
            retObj = null;
          }

          return cb(retObj);
        });
    }
  }
}