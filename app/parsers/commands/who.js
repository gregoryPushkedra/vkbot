'use strict';

const lang = require('../../config/commands/lang').who;
const randomElem = require('../../other/helpers').randomElem;
const chatUsersIds = require('../../other/helpers').chatUsersToArrayOfIds;

/**
 * Получение рандомного пользователя из списка
 */
module.exports = (arg, callback) => {
  let chatUsers = arg.wholeObj().chatUsers;
  let randomUserName;

  if (chatUsers) 
    randomUserName = chatUsers[randomElem(chatUsersIds(chatUsers))];

  return callback({
    message: randomUserName ? (randomElem(lang.answerWords) + randomUserName) : randomElem(lang.noUsersAnswers)
  });
}