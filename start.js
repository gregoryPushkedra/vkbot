'use strict';

let app = require('./app');
let parsers = require('./app/parsers');

if (process.argv.slice(2)[0] === '-debug') 
  process.env.DEBUG = true;

let params = {
  appId: ID, 
  login: 'LOGIN', 
  pass: 'PASS', 
  antiCaptchaKey: 'KEY'
}

app
  .configure(params)
  .use(parsers)
  .start();