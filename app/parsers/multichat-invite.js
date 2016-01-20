'use strict';

const lang = require('./config/lang');

module.exports = messageObj => {
  return {
    cond: (messageObj.attachments.source_act === 'chat_invite_user' && messageObj.attachments.source_mid === messageObj.botId) || (messageObj.attachments.source_act === 'chat_create'), 
    fn: cb => cb(lang.greeting)
  }
}