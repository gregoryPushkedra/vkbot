'use strict';

const prequest = require('request-promise');
const debug = require('./modules/simple-debug');

const helpers = require('./other/helpers');

class Messages {
  constructor (link, vk, botId) {
    this.__link = link;
    this.__vkapi = vk;
    this.__botId = parseInt(botId);

    this.__parsers = null;
    this.__middlewares = null;
    this.__cleverbot = null;

    this.__botDelays = {
      first: 0, // time of last message was sent by bot
      last: 0, // time of last delayed message
      delay: 5000 // delay in ms
    }

    this.__state = {
      chatUsers: {
        // chat-id: chat users Object { user-id: username }
      }, 
      lastMessage: {
        user: {
          // chat-id: message String (last message was sent by user)
        }, 

        bot: {
          // chat-id: message String (last message was sent by bot)
        }
      }
    }
  }

  __applyMiddlewares (messageObj) {
    return new Promise(resolve => {
      let newVars = [];
      let output;

      debug('= Applying middlewares');

      for (let i = 0, len = this.__middlewares.length; i < len; i++) 
        newVars.push(this.__middlewares[i](messageObj));

      output = Object.assign(messageObj, ...newVars);

      return resolve(output);
    });
  }

  __applyParser (messageObj) {
    return new Promise(resolve => {
      let parserToUse = this.__parsers.filter(v => v(messageObj).cond).map(v => v(messageObj).fn)[0];

      if (parserToUse === undefined) 
        return resolve(null);

      debug('= Applying a parser to message');

      return parserToUse(res => resolve(res));
    });
  }

  __apply (messageObj) {
    return this.__applyMiddlewares(messageObj)
      .then(m => this.__applyParser(m))
      .catch(e => {
        debug('- Error in "Messages.__apply" function was occured: ');
        debug(e);

        return null;
      });
  }

  __updateFullLinkAndStart () {
    this.__vkapi.call('execute.getLongPollServerLink').then(link => {
      this.__link = link;

      return this.check();
    });
  }

  __updateLink (ts) {
    this.__link = this.__link.replace(/ts=.*/, 'ts=' + ts);
  }

  __updateChatComp (chat_id) {
    return this.__vkapi.call('messages.getChatUsers', { chat_id, fields: 'first_name' })
      .then(res => {
        let chatUsers = helpers.chatUsersArrayToObj(res);

        // remove Bot from list of chat users
        delete chatUsers[this.__botId];

        this.__state.chatUsers[chat_id] = chatUsers;
      });
  }

  __makeMsgObj (mesOld, mesNew) {
    if (mesNew === null) 
      return null;

    if (typeof mesNew === 'string') 
      mesNew = { message: mesNew };

    let _to = mesOld.isMultichat ? 'chat_id' : 'user_id';
    let _toId = mesOld.chatId;

    return {
      [_to]: _toId,
      message: mesNew.message || '', 
      attachment: mesNew.attachments ? (Array.isArray(mesNew.attachments) ? mesNew.attachments.join(',') : mesNew.attachments.toString()) : '', 
      forward_messages: mesNew.forward ? mesOld.messageId : ''
    }
  }

  __checkPmFlags (flag) {
    let flags = [33, 49, 545, 561];

    return !!~flags.indexOf(flag);
  }

  __processUpdates (updates, callback) {
    debug('= Processing updates');

    updates.forEach(value => {
      // updating chat users list
      if (value[0] === 51 && this.__state.chatUsers[value[1]]) 
        this.__updateChatComp(parseInt(value[1]));

      // checking all incoming messages except messages from Bot
      if (value[0] === 4 && ((value[7].from && parseInt(value[7].from) !== this.__botId) || this.__checkPmFlags(value[2]))) {
        let message = value[6];
        let messageId = value[1];
        let attachments = value[7];

        let convId = parseInt(value[3]); // conversation ID
        let mchatId = convId - 2000000000; // multichat ID
        let mchatFromId = parseInt(attachments.from); // from ID in multichat

        let isMultichat = mchatFromId || false;
        let dialogId = isMultichat ? mchatId : convId;
        let fromId = isMultichat ? mchatFromId : convId;

        // current chat users were not got, getting them
        if (isMultichat && !this.__state.chatUsers[mchatId]) 
          this.__updateChatComp(mchatId);

        // if two last messages from users are identical => skip this update-value
        if (message === this.__state.lastMessage.user[dialogId]) 
          return;

        // saving last message
        this.__state.lastMessage.user[dialogId] = message;

        // message object (will be used in middlewares & parsers)
        let messToParse = {
          _cleverbot: this.__cleverbot, 
          _vkapi: this.__vkapi, 
          attachments, 
          botId: this.__botId, 
          chatId: dialogId, 
          chatUsers: isMultichat && this.__state.chatUsers[mchatId] || null, 
          fromId, 
          isMultichat, 
          message, 
          messageId
        }

        return this.__apply(messToParse)
          .then(mesObj => this.__makeMsgObj(messToParse, mesObj))
          .then(m => this.send(m));
      }
    });

  return callback();
  }

  check () {
    debug('+ Connected to long-poll server');

    return prequest(this.__link, { json: true }).then(res => {
      // need to update long-poll data
      if (res.failed && res.failed !== 1) 
        return this.__updateFullLinkAndStart();

      // build a new link with updated timestamp
      this.__updateLink(res.ts);

      // no updates
      if (!res.updates || res.updates.length < 1) 
        return this.check();

      debug('+ Updates were received');

      // process updates
      return new Promise(resolve => this.__processUpdates(res.updates, () => resolve()));
    });
  }

  send (messageObj) {
    if (messageObj === null) 
      return Promise.resolve();

    debug('= Sending a message');
    
    let dateNow = Date.now();
    let delay;

    // set up delays between sending messages

    if ((dateNow - this.__botDelays.first) >= this.__botDelays.delay) {
      delay = 0;
    } else {
      delay = this.__botDelays.delay - (dateNow - this.__botDelays.first);

      if ((dateNow - this.__botDelays.last) <= 0) 
        delay = this.__botDelays.last - dateNow + this.__botDelays.delay;

      this.__botDelays.last = delay + dateNow;
    }

    return setTimeout(() => {
      this.__vkapi.call('messages.send', helpers.encodeParams(messageObj))
        .then(r => {
          debug(r ? '+ Message was sent' : '= Nothing to send');

          this.__botDelays.first = Date.now();
        })
        .catch(e => {
          debug('- Error was occured during sending a message');
          debug(e);
        });
    }, delay);
  }
}

module.exports = Messages;