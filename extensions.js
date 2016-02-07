'use strict';

const pm2 = require('pm2');

const VKApi = require('node-vkapi');

class Extensions {
  constructor () {
    this.__interval = 5; // in minutes

    this.__vkapi = new VKApi({ token: require('./token').access_token });
  }

  start () {
    return this.__checking(true);
  }

  shutdown () {
    return this.__setStatus('😴 Оффлайн');
  }

  __checking (firstStart) {
    return setTimeout(() => {
      return this.__getStatus()
        .then(s => this.__setStatus(s))
        .then(() => this.__checking())
        .catch(() => this.__checking());
    }, firstStart ? 0 : this.__interval * 60 * 1000);
  }

  __getUptime (createTime) {
    let uptime = Math.round((Date.now() - createTime)/1000/60); // in minutes

    let days = Math.floor(uptime/(60*24));
    let hours = Math.floor((uptime - (days*60*24))/60);
    let minutes = Math.round(uptime % 60);

    let uptimeText = (days !== 0 ? (days + ' дн. ') : '') + (hours !== 0 ? (hours + ' ч. ') : '') + (minutes !== 0 ? (minutes + ' мин.') : '');

    if (uptimeText.trim() === '') 
      uptimeText = 'бот только что запущен :)';

    return uptimeText;
  }

  __getStatus () {
    return new Promise(resolve => pm2.connect(() => pm2.list((err, list) => {
      let status = list[0].pm2_env.status;
      let createTime = list[0].pm2_env.created_at;

      let uptime = this.__getUptime(createTime);
      let statusText = status === 'online' ? ('✅ Онлайн | Аптайм: ' + uptime) : '😴 Оффлайн'

      return resolve(statusText);
    })));
  }

  __setStatus (status) {
    return this.__vkapi.call('execute.statusAndFriends', {
      s: encodeURIComponent(status), 
      act: ~status.indexOf('Офф') ? 'off' : 'on'
    });
  }
}

module.exports = Extensions;