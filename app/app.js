'use strict';

const EventEmitter = require('events').EventEmitter;

const VKApi = require('node-vkapi');
const debug = require('./modules/simple-debug');

const Init = require('./init');

class App extends EventEmitter {
  constructor () {
    super();

    this.__configured = false;
    this.__initialized = false;

    this.__parsers = []; // Parsers
    this.__middlewares = []; // Middlewares

    this.__m = null; // Messages instance
    this.__errNum = 0; // Number of errors catched
  }

  __init () {
    if (this.__initialized === true) 
      return Promise.resolve();

    if (!this.__configured || this.__parsers.length === 0) 
      throw new Error('Use "app.configure(<params>)" and "app.use(<parsers>)" before "app.start()".');

    debug('= Initializating app');

    return (new Init(this.__vkParams)).init()
      .then(res => {
        this.__initialized = true;

        this.__m = res.Messages;
        this.__m.__parsers = this.__parsers;
        this.__m.__middlewares = this.__middlewares;

        delete this.__parsers;
        delete this.__middlewares;
        delete this.__vkParams;

        debug('+ App was initialized');

        this.emit('initialized');
      })
      .catch(err => {
        debug('- Unable to initialize app');
        debug(err);

        process.exit(1);
      });
  }

  /**
   * Configuring an app
   * @param  {Object} params
   * @return {App instance}
   */
  configure (params) {
    if (!(params && params.login && params.pass && params.appId)) 
      return this;

    this.__vkParams = {
      appId: params.appId, 
      authData: {
        login: params.login, 
        pass: params.pass
      }, 
      captcha: {
        antiCaptchaKey: params.antiCaptchaKey || null
      }
    };

    this.__configured = true;

    return this;
  }

  /**
   * Setting up parsers & middlewares
   * @param  {Object} obj
   * @return {App instance}
   */
  use (obj) {
    for (let key in obj) {
      let value = obj[key];
      let varName = `__${key}`;

      if (Array.isArray(value)) 
        this[varName].push(...value);

      if (typeof value === 'function') 
        this[varName].push(value);
    }

    return this;
  }

  /**
   * Starting an app
   */
  start () {
    return this.__init() // init an app
      .then(() => this.__m.check()) // check for new messages and send replies
      .then(() => this.start()) // start a new cycle
      .catch(e => { // catching errors
        debug('* Something went wrong. Errors catched {' + ++this.__errNum + '} times. ');
        debug('* After 3rd catch process will be killed.');
        debug(e);

        if (this.__errNum === 3) 
          process.exit(1);

        return this.start();
      });
  }
}

module.exports = new App();
