'use strict';

const Extensions = require('./extensions');

let app = require('./app');
let parsers = require('./app/parsers');
let middlewares = require('./app/middlewares');

let ext;

if (process.argv.slice(2)[0] === '-debug') 
  process.env.DEBUG = true;

/**
 * Starting App
 */

let params = {
  appId: ID, // int
  login: 'LOGIN', // string
  pass: 'PASS', // string
  antiCaptchaKey: null // string or null
}

app
  .configure(params)
  .use({ parsers, middlewares })
  .start();

app.once('initialized', () => {
  ext = new Extensions();
  ext.start();
});

// SIGINT signall received
process.on('SIGINT', () => ext.shutdown());