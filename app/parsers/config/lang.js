'use strict';

const config = require('./config');

/**
 * <command_name>: [<desc>, <args>]
 */
const help = {
  addme: [
    'Приглашает в рандомную беседу с ботом.', 
    ''
  ], 

  create: [
    'Создает беседу со случайными друзьями бота.\n\nМаксимальное количество = ' + config.create.max, 
    '<кол-во>'
  ], 

  goaway: [
    'Выгоняет бота из чата. Он больше не вернется. :(', 
    ''
  ], 

  help: [
    cmds => 'Доступные команды:\n\n' + cmds + '\n\nПри вводе команд, символы "<", ">" вводить не надо.\n\nЧтобы получить помощь по определенной команде, напишите /help "название_команды" (без кавычек).\n\nБот имеет задержку в 5 секунд между отправкой сообщений, будьте терпеливы.', 
    '[<команда>]'
  ], 

  howhot: [
    'Определяет, насколько сексуален человек на фото. \n\nДля использования команды нужно прикрепить одно изображение, на котором есть лицо человека.', 
    '<изображение>'
  ], 

  howold: [
    'Определяет возраст человека на фото. \n\nДля использования команды нужно прикрепить одно изображение, на котором есть как минимум одно лицо человека.', 
    '<изображение>'
  ], 

  img: [
    'По введённому запросу находит изображение в Google.', 
    '<запрос>'
  ], 

  info: [
    'Определяет вероятность события, утверждения и т.д.', 
    '<текст>'
  ], 

  invite: [
    'Приглашает в беседу рандомного друга бота.', 
    ''
  ], 

  klass: [
    'По введённому запросу находит изображение на сайте stavklass.ru\n\nЕсли запрос не задан, будет получено рандомное изображение.', 
    '[<запрос>]'
  ], 

  music: [
    'По введённому запросу находит музыку в ВКонтакте. \n\nМаксимальное количество = ' + config.search.music.max, 
    '<запрос> [<кол-во>]'
  ], 

  photo: [
    'По введённому запросу находит фотографии в ВКонтакте. \n\nМаксимальное количество = ' + config.search.photo.max, 
    '<запрос> [<кол-во>]'
  ], 

  random: [
    'Присылает случайное число из указанного диапазона.\nДиапазон чисел по умолчанию: ' + config.random.default + '\n\nПримеры:\n/random 5 -- число от 0 до 5\n/random 5-25 -- число от 5 до 25\n/random -- число из диапазона по умолчанию (' + config.random.default + ')', 
    '[<диапазон>]'
  ], 

  tts: [
    'Озвучивает введённый вами текст. (Макс. 1500 символов)', 
    '<текст>'
  ], 

  video: [
    'По введённому запросу находит видео в ВКонтакте. \n\nМаксимальное количество = ' + config.search.video.max, 
    '<запрос> [<кол-во>]'
  ], 

  who: [
    'Выбирает случайного пользователя из беседы.', 
    '<текст>'
  ]
}

/**
 * Шаблоны для ответов при запросе команды /who
 */
const who = {
  answerWords: [
    'Я думаю, это ', 
    'Определенно, это ', 
    'Несомненно, это ', 
    'Мне кажется, что это '
  ], 

  noUsersAnswers: [
    'Не скажу.', 
    'Не хочу говорить.', 
    'У меня нет настроения тебе отвечать.'
  ]
}

module.exports = {
  // multichat-invite.js
  greeting: 'Привет! Я -- чат-бот. Помимо общения, умею выполнять команды.\n\nПомощь: /help', 

  // help texts
  help, 

  // only for /who
  who
}