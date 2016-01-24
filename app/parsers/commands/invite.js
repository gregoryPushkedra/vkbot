'use strict';

const randomElem = require('../../other/helpers').randomElem;

/**
 * Приглашает в беседу рандомного друга (друга бота)
 */
module.exports = (arg, callback) => {
  let argObj = arg.wholeObj();
  let VK = argObj._vkapi;
  let chatUsers = argObj.chatUsers;

  // беседа переполнена
  if (chatUsers && chatUsers.length === 50) 
    return callback(null);

  return VK.call('friends.get', {
    order: 'random', 
    count: 100
  }).then(res => {
    let friends = res.items.filter(v => !~Object.keys(chatUsers).indexOf(v.toString()));

    if (friends.length === 0) 
      return callback(null);

    return VK.call('messages.addChatUser', {
      chat_id: argObj.chatId, 
      user_id: randomElem(friends)
    });
  }).then(success => callback(null));
}
