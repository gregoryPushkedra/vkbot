'use strict';

let app = require('./app');
let parsers = require('./app/parsers');

let params = {
  appId: ID, 
  login: PASS, 
  pass: LOGIN, 
  antiCaptchaKey: KEY
}

app
  .configure(params)
  .use(parsers)
  .start();