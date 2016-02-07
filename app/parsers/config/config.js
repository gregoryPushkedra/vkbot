'use strict';

module.exports = {

  // __vk-search.js
  search: {
    music: {
      label: 'audio', 
      attach: 'audio', 
      text: 'Аудиозаписи', 
      max: 5, 
      params: {
        auto_complete: 0, // не исправлять ошибки в запросе
        lyrics: 0, // находить аудио не только со словами, но и без
        performer_only: 0, // искать не только по исполнителю
        sort: 2 // сортировать по популярности
      }
    }, 

    video: {
      label: 'video', 
      attach: 'video', 
      text: 'Видеозаписи', 
      max: 5, 
      params: {
        hd: 0, // искать не только HD
        adult: 1, // искать без "Безопасного поиска"
        sort: 2 // сортировать по релевантности
      }
    }, 

    photo: {
      label: 'photos', 
      attach: 'photo', 
      text: 'Фотографии', 
      max: 8, 
      params: {
        sort: 1
      }
    }
  }, 

  // create.js
  create: {
    max: 20, 
    default: 3
  }, 

  // random.js
  random: {
    default: '0-100'
  }, 

  // Папки, в которых хранятся временные файлы (путь указан от /app/. (где находится файл start.js))
  path: {
    howhot: './temp/commands/howhot/', 
    img: './temp/commands/img/', 
    klass: './temp/commands/klass/', 
    tts: './temp/commands/tts/', 
    ttsEmpty: './static/commands/tts/blank_5sec.mp3'
  }
}