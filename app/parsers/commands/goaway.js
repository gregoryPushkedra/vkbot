'use strict';

/**
 * Kicks Bot from a multichat
 */
module.exports = (arg, callback) => {
  let argObj = arg.wholeObj();
  let VK = argObj._vkapi;

  return VK.call('messages.removeChatUser', {
    chat_id: argObj.chatId, 
    user_id: argObj.botId
  }).then(() => callback(null));
}