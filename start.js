'use strict';

let app = require('./app');
let parsers = require('./app/parsers');

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