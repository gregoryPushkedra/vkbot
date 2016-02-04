'use strict';

const config = require('../config/config');

module.exports = function (messageObj) {
  let isM = messageObj.isMultichat;
  let msg = messageObj.message;

  return {
    cond: isM ? config.bot.pattern.test(msg) : !msg.startsWith('/'), 
    fn: cb => {
      let message = msg.substr(isM ? 4 : 0).trim();

      return (function getAnswer () {
        return messageObj._cleverbot.write(message)
          .then(ans => {
            let lAns = ans.toLowerCase();
            let lMes = message.toLowerCase();

            if (/[а-я]/.test(lMes) && !/[а-я]/.test(lAns) && /clever/.test(lAns)) 
              return getAnswer();

            if (!/[а-я]/.test(lMes) && /clever[mbs]/.test(lAns)) 
              return getAnswer();

            let retObj;

            if (ans.length > 0) {
              retObj = {
                message: ans,
                forward: isM
              }
            } else {
              retObj = null;
            }

            return cb(retObj);
          });
      })();
    }
  }
}