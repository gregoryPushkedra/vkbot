'use strict';

const VKApi = require('node-vkapi');
const debug = require('./modules/simple-debug');

const Init = require('./init');

class App {
  constructor () {
    this.__initialized = false;
    this.__configured = false;
    this.__parsers = []; // Parsers to use
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

        delete this.__parsers;
        delete this.__vkParams;

        debug('+ App was initialized');
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
      }
    };

    this.__configured = true;

    return this;
  }

  /**
   * Setting up parsers
   * @param  {Array} parsers
   * @return {App instance}
   */
  use (parsers) {
    if (Array.isArray(parsers)) 
      this.__parsers.push(...parsers);

    if (typeof parsers === 'function') 
      this.__parsers.push(parsers);

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