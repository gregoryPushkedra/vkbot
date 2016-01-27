'use strict';

const fs = require('fs');

const VKApi = require('node-vkapi');
const debug = require('./modules/simple-debug');

const Messages = require('./messages');
const Cleverbot = require('./modules/cleverbot');

class InitApp {
  constructor (params) {
    this.__vkapi = new VKApi(params);
    this.__scope = 'notify,friends,photos,audio,video,docs,notes,pages,status,wall,groups,messages,notifications,stats,offline';
  }

  /**
   * Init an app
   */
  init () {
    let returnObj = {};
    let botId = null;

    return this.__checkForToken()
      .then(tokenObj => {
        if (tokenObj !== null) {
          this.__vkapi.options.token = tokenObj.access_token;
          botId = tokenObj.user_id;

          debug('+ Token was got from "token.json"');

          return this.__getLongPollUrl();
        }

        return this.__getToken()
          .then(tokenObj => {
            botId = tokenObj.user_id;

            return this.__saveToken(tokenObj);
          })
          .then(() => {
            debug('+ Token was got and saved to "token.json"')

            return this.__getLongPollUrl();
          });
      })
      .then(link => {
        debug('+ Long-poll server url was got');

        returnObj.Messages = new Messages(link, this.__vkapi, botId);

        return Cleverbot.init();
      })
      .then(cleverIns => {
        debug('+ CleverBot was initialized');

        returnObj.Messages.__cleverbot = cleverIns;

        return returnObj;
      });
  }

  /**
   * Checking for token existance on disk
   */
  __checkForToken () {
    return new Promise((resolve, reject) => {
      if (~fs.readdirSync('./').indexOf('token.json')) 
        return resolve(require('../token'));

      return resolve(null);
    })
  }

  /**
   * Getting token by login and password
   */
  __getToken () {
    return this.__vkapi.getTokenByLogin({ scope: this.__scope }); // get and save access_token
  }

  /**
   * Getting long-poll server url
   */
  __getLongPollUrl () {
    return this.__vkapi.call('execute.getLongPollServerLink');
  }

  /**
   * Saving token on disk
   * @param  {Object} tokenObj
   */
  __saveToken (tokenObj) {
    delete tokenObj.expires_in;

    return new Promise(resolve => fs.writeFile('./token.json', JSON.stringify(tokenObj), () => resolve()))
  }
}

module.exports = InitApp;
