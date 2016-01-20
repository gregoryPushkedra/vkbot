'use strict';

const crypto = require('crypto');
const http = require('http');

const prequest = require('request-promise');

class Cleverbot {
  constructor (cookies) {
    this.__params = {
      'stimulus': '', 
      'start': 'y', 
      'sessionid': '',
      'vText8': '', 
      'vText7': '', 
      'vText6': '',
      'vText5': '', 
      'vText4': '', 
      'vText3': '',
      'vText2': '', 
      'icognoid': 'wsf', 
      'icognocheck': '',
      'fno': '0', 
      'prevref': '', 
      'emotionaloutput': '',
      'emotionalhistory': '', 
      'asbotname': '', 
      'ttsvoice': '',
      'typing': '', 
      'lineref': '', 
      'sub': 'Say',
      'islearning': '1', 
      'cleanslate': 'false'
    };
    this.__parserKeys = [
      'message', 
      'sessionid', 
      'logurl', 
      'vText8',
      'vText7', 
      'vText6', 
      'vText5', 
      'vText4',
      'vText3', 
      'vText2', 
      'prevref', 
      '',
      'emotionalhistory', 
      'ttsLocMP3', 
      'ttsLocTXT', 
      'ttsLocTXT3',
      'ttsText', 
      'lineref', 
      'lineURL', 
      'linePOST',
      'lineChoices', 
      'lineChoicesAbbrev', 
      'typingData', 
      'divert'
    ];
    this.__cookies = cookies;
  }

  static init () {
    return prequest('http://www.cleverbot.com/', { resolveWithFullResponse: true })
      .then(res => {
        if (res.headers && res.headers['set-cookie']) {
          let list = res.headers['set-cookie'];
          let cookies = [];

          for (let i = 0, llen = list.length; i < llen; i++) 
            cookies.push(list[i].split(';')[0]);

          cookies = cookies.join(';');

          return new Cleverbot(cookies);
        }

        throw new Error('Unable to init CleverBot.');
      });
  }

  __digest (body) {
    return crypto.createHash('md5').update(body).digest('hex');
  }

  __encodeParams (params) {
    let output = [];

    for (let x in params) {
      if (params[x] instanceof Array)
        output.push(x + "=" + encodeURIComponent(params[x].join(",")));
      else
        output.push(x + "=" + encodeURIComponent(params[x]));
    }

    return output.join("&");
  }

  __parseAnswer (text) {
    let output = text;

    if (output.length < 5) 
      return '';

    let unicodes = output.match(/(\|[0-9A-F][0-9A-F][0-9A-F][0-9A-F])/g);

    if (unicodes) {
      for (let i = 0, ulen = unicodes.length; i < ulen; i++) {
        output = output.replace(unicodes[i], String.fromCharCode(parseInt(unicodes[i].substr(1), 16)))
      }
    }

    return output;
  }

  write (message) {
    let body = this.__params;
        body.stimulus = message;
        body.icognocheck = this.__digest(this.__encodeParams(body).substring(9, 35));
    let bodyEncoded = this.__encodeParams(body);

    return prequest.post('http://www.cleverbot.com/webservicemin', {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': bodyEncoded.length,
          'Cache-Control': 'no-cache',
          'Cookie': this.__cookies
      }, 
      body: bodyEncoded
    }).then(res => {
      let answer = res.split('\r')[0];

      return this.__parseAnswer(answer);
    });
  }
}

module.exports = Cleverbot;