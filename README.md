## Chatbot for VKontakte (vk.com)

Live example: [vk.com/chatsbot](http://vk.com/chatsbot)

##### Features
1. Replies to messages using cleverbot.com answers database.
2. Performs commands
3. Accepts friend requests automatically
4. Updates status automatically (prints actual bot state)
5. Easy adding new commands (см. [Добавление команд](#Добавление-своих-команд))  
   Parsers (см. [Добавление парсеров](#Добавление-своих-парсеров))  
   And middlewares (?)

### Installation
    $ git clone git://github.com/olnaz/vkbot.git && cd vkbot && npm install
    $ sudo npm install pm2 -g

### Setting up

#### Application
Go to [vk.com/apps](http://vk.com/apps) and create your own "Standalone" application.  
Open settings of the app and add new methods from **__execute** folder (method name = file name without _.js_)

#### File `start.js`
Open the file `start.js` and specify App ID, Login and Password of bot account.  
Also you can specify anti-captcha.com API-key needed for recognizing captcha.

### Starting
    $ sudo pm2 start start.js --name vkbot
    $ sudo pm2 start start.js --name vkbot -- -debug && sudo pm2 logs // debug-режим

### Process monitoring
    $ sudo pm2 monit

PM2 documentation: [github.com/Unitech/pm2](https://github.com/Unitech/pm2)
    
After the first start `access_token` will be saved to **./token.json**.


### Adding parsers
Parsers are need for processing incoming messages and running certain script depending on the message body.  
They are in the **app/parsers** folder.

Amount of parsers isn't limited, but to the incoming message will be applied **first** parser fit for condition.  
To force the app to use your parser, you need to put it into **app/parsers** folder.

Пример кода парсера:
```javascript
// app/parsers/example.js
'use strict';

module.exports = function (messageObj) {
  return {
    cond: messageObj.message.startsWith('@@@'), 
    fn: callback => {
      return callback({
        message: '@@@ Сообщение-ответ', 
        forward: messageObj.isMultichat
      });
    }
  }
}
```

То есть каждый .js-файл (парсер) должен экспортировать функцию, которая принимает один аргумент (объект с входящим сообщением `messageObj`) и возвращает объект с одним свойством `cond` и одним методом `fn`.

`messageObj` всегда содержит следующие свойства:
* `_cleverbot` (Object): экземпляр класса __Cleverbot__. Используется в парсере _appeal.js_.
* `_vkapi` (Object): экземпляр класса __VKApi__
* `attachments` (Object): объект прикреплений во входящем сообщении (см. [vk.com/dev/using_longpoll](http://vk.com/dev/using_longpoll))
* `botId` (Number): ID текущего бота
* `chatId` (Number): ID текущей беседы (если он отрицательный, используйте `fromId`)
* `chatUsers` (Object): Объект с пользователями текущей беседы (Формат: _{userId: userFirstName}_)
* `fromId` (Number): ID пользователя, от которого пришло сообщение (если сообщение пришло в беседе, используйте `attachments.from`)
* `isMultichat` (Boolean): _true_, если сообщение пришло в беседе
* `message` (String): текст сообщения
* `messageId` (Number): ID сообщения

`cond` - условие, при котором данный парсер будет использован. (Здесь, условие: _входящее сообщение начинается с @@@_)  
`fn` - callback-функция, которая будет вызвана, если _cond === true_.

Внутри функции `fn` необходимо, по завершении операций, вызывать `callback(Object)`, где `Object` - объект с возвращаемыми данными. 

`Object` может содержать следующие свойства:
* `message` (String): сообщение, которое будет отправлено ботом
* `attachments` (String/Array of Strings): прикрепления к сообщению (если необходимо). Формат прикреплений: [vk.com/dev/messages.send](https://vk.com/dev/messages.send)
* `forward` (Boolean): _true_ - пересылать исходное сообщение

Также в `Object` вы можете просто передать строку.  
Тогда приложение посчитает, что `message` = _переданная строка_, а `attachments` и `forward` = _null_.


### Добавление своих команд
Все команды находятся в папке **app/parsers/commands**.  
Файлы, названия которых начинаются с "__", являются "приватными" и могут быть использованы только внутри приложения.  
Простой пользователь из ВКонтакте не сможет вызвать команду *__list.js* или *__vk-search.js*.

Чтобы добавить свою команду в приложение, необходимо поместить .js-файл с кодом команды в папку **app/parsers/commands**.  
Также не забудьте добавить описание к вашей команде в файл **app/config/commands/lang.js**.

Каждый .js-файл с кодом команды должен экспортировать функцию, которая принимает два аргумента: `arg` и `callback`.  

`arg` - парсер аргументов  
`callback` - callback-функция, идентичная той, что в парсерах входящих сообщений (см. [Добавление парсеров](#Добавление-своих-парсеров))

`arg` получает на вход исходный объект с входящим сообщением и облегчает парсинг переданных аргументов. 

Объект `arg` содержит следующие методы:
* `firstWord()`: вернет первое слово
* `fullText()`: вернет весь текст
* `textAndNum()`: вернет массив [текст, число] или [текст], если число не было передано (Используется в командах _/music_, _/video_, _/photo_ и т.д.)
* `attachment(type)`: вернет массив [attachment, messageId], либо **null** (Используется в командах _/howold_, _/howhot_)
* `wholeObj()`: вернет исходный объект с входящим сообщением

Пример кода команды:
```javascript
// app/parsers/commands/klass.js
'use strict';

const fs = require('fs');
const prequest = require('request-promise');
const parsers = require('./include/parsers');
const pathConfig = require('../../config/commands/config').path;

/**
 * Ищет и возвращает мемчик с сайта stavklass.ru по запросу
 */
module.exports = (arg, callback) => {
  let argText = arg.fullText();
  let VK = arg.wholeObj()._vkapi;

  let reqUrl = 'http://stavklass.ru/images/search?image[text]=' + encodeURIComponent(argText);
  let randomUrl = 'http://stavklass.ru/images/random.jpg?n=' + Date.now();

  let fileName = pathConfig['klass'] + 'klass_' + Date.now() + '.jpg';
  let isRandom = argText === 'random';

  reqUrl = isRandom ? randomUrl : reqUrl;

  return prequest(reqUrl, { encoding: isRandom ? null : 'utf8' })
        .then(res => isRandom ? res : parsers.parseStavKlassImgUrl(res))
        .then(imgurl => isRandom ? imgurl : prequest(imgurl, { encoding: null }))
        .then(imgbody => new Promise(resolve => fs.writeFile(fileName, imgbody, () => resolve(fileName))))
        .then(file => VK.upload('photo_pm', fs.createReadStream(file)))
        .then(res => {
          try {
            fs.unlinkSync(fileName);
          } catch (e) {}

          return callback({
            attachments: 'photo' + res[0].owner_id + '_' + res[0].id
          });
        })
        .catch(err => {
          if (err !== undefined && err.statusCode == '500') {
            return callback({
              message: 'По запросу <<' + argText + '>> ничего не найдено.'
            });
          }
        });
}
```


### About commands
Списки команд для бесед и персональных сообщений разные, имейте это в виду.  
Указать, какие команды являются уникальными, можно в файле **app/parsers/commands/__list.js**.
