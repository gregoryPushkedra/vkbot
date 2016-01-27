'use strict';

process.env.DEBUG = true; // DEBUG = true by default

const pm2 = require('pm2');

const debug = require('./app/modules/simple-debug');
const VKApi = require('node-vkapi');

(function () {
  let interval = 5; // in minutes
  let VK;

  function setStatus (status) {
    return VK.call('execute.statusAndFriends', {
      s: encodeURIComponent(status), 
      act: ~status.indexOf('Офф') ? 'off' : 'on'
    }).then(() => autocheck()).catch(() => autocheck());
  }

  function getUptime (createTime) {
    let uptime = Math.round((Date.now() - createTime)/1000/60); // in minutes

    let days = Math.floor(uptime/(60*24));
    let hours = Math.floor((uptime - (days*60*24))/60);
    let minutes = Math.round(uptime % 60);

    return (days !== 0 ? (days + ' дн. ') : '') + (hours !== 0 ? (hours + ' ч. ') : '') + (minutes !== 0 ? (minutes + ' мин.') : '');
  }

  function getStatus (cb) {
    return pm2.connect(() => pm2.list((err, list) => {
      let status = list[0].pm2_env.status;
      let createTime = list[0].pm2_env.created_at;

      let uptime = getUptime(createTime);
      let statusText = status === 'online' ? ('✅ Онлайн | Аптайм: ' + uptime) : '😴 Оффлайн'

      return cb(statusText);
    }));
  }

  function autocheck () {
    debug('* Autochecking after ' + interval + ' minutes.', true);

    return setTimeout(() => getStatus(s => setStatus(s)), interval * 60 * 1000);
  }

  function shutdown () {
    return setStatus('😴 Оффлайн');
  }

  // Starting in one minute
  setTimeout(() => {
    VK = new VKApi({ token: require('./token').access_token });

    return autocheck();
  }, 60*1000);

  // SIGINT signall received
  process.on('SIGINT', () => shutdown());
})();