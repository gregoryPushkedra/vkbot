'use strict';

const spawn = require('child_process').spawn;

let app = require('./app');
let parsers = require('./app/parsers');

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
  .use(parsers)
  .start();

/**
 * Starting extentions (auto-status, auto-adding friends)
 */

spawn('sudo', ['pm2', 'start', 'autochecks.js', '--name', 'achks'], {
  stdio: 'ignore', 
  detached: true
}).unref();
