'use strict';

class ArgParser {
  constructor (msgObj) {
    this.__msgObj = msgObj;
    this.isNull = false;
  }

  attachment (type) {
    let arg;

    if (this.__msgObj.attachments.attach1_type === type) 
      arg = [this.__msgObj.attachments.attach1, this.__msgObj.messageId];
    else
      arg = null;

    return arg;
  }

  firstWord () {
    return this.__msgObj.message.split(' ')[1] || null;
  }

  fullText () {
    let mess = this.__msgObj.message;
    let spaceIndex = mess.indexOf(' ');

    return spaceIndex === -1 ? null : (mess.substr(spaceIndex).trim() || null);
  }

  textAndNum () {
    let argWithoutCmd = this.fullText();
    let argTextAndNum = argWithoutCmd.match(/(.+)(?:\s\b)(\d+(?=\b))/);
    let arg;

    /**
     * "Сматчить" запрос вместе числом (кол-во получаемых записей) не удалось. 
     * Это значит, что число не введено. либо текста нет вовсе.
     */
    if (argTextAndNum === null) {
      // Длина запроса более 2-х символов, можно искать.
      if (argWithoutCmd.length > 2) 
        arg = [argWithoutCmd];
      else 
        arg = [null];
    } else {
      arg = [argTextAndNum[1].trim(), argTextAndNum[2]];
    }

    return arg;
  }

  wholeObj () {
    return this.__msgObj;
  }
}

module.exports = msgObj => {
  let parser = new ArgParser(msgObj);
  let textArg = msgObj.message.split(' ')[1];
  let attach = msgObj.attachments.attach1;

  if ((textArg === '' || textArg === undefined) && !attach) 
    parser.isNull = true;

  return parser;
}