'use strict';

const lang = require('../config/lang').who;
const randomElem = require('../../other/helpers').randomElem;

/**
 * Получение рандомного пользователя из списка
 */
module.exports = (arg, callback) => {
  let chatUsers = arg.wholeObj().chatUsers;
  let randomUserName;

  if (arg.isNull) 
    return callback(null);

  if (chatUsers) 
    randomUserName = chatUsers[randomElem(Object.keys(chatUsers))];

  return callback(randomUserName ? (randomElem(lang.answerWords) + randomUserName) : randomElem(lang.noUsersAnswers));
}