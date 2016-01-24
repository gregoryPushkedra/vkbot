'use strict';

const randomElem = require('../../other/helpers').randomElem;

/**
 * Приглашает пользователя в случайную беседу
 */
module.exports = (arg, callback) => {
  let mObj = arg.wholeObj();
  let VK = mObj._vkapi;
  let userId = mObj.fromId;

  return VK.call('messages.getDialogs', { count: 200 })
    .then(res => {
      let dialogs = res.items.filter(v => v.message.users_count < 50).map(v => v.message.chat_id);

      return VK.call('messages.addChatUser', {
        chat_id: randomElem(dialogs), 
        user_id: userId
      });
    })
    .then(success => callback(null)) // успешно приглашен
    .catch(err => {
      return callback('Не удалось пригласить вас в беседу :(\n\nПричины:\n1. Беседа переполнена\n2. Вы уже состоите в этой беседе');
    });
}