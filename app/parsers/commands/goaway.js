'use strict';

/**
 * Выгоняет бота из текущего чата. 
 *
 * Необходимо, чтобы был передан параметр 'now!' (чего в помощи по команде не написано)
 */
module.exports = (arg, callback) => {
  let argObj = arg.wholeObj();
  let VK = argObj._vkapi;
  let reallyRemove = arg.firstWord() === 'now!';

  if (!reallyRemove) 
    return callback(null);

  return VK.call('messages.removeChatUser', {
    chat_id: argObj.chatId, 
    user_id: argObj.botId
  }).then(() => callback(null));
}