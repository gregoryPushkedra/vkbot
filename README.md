Чат-бот для ВКонтакте. Умеет отвечать на сообщения и выполнять различные команды.
Работает через Long-Poll и отвечает мгновенно или с задержкой, если это необходимо.

##### Что умеет
1. Отвечать на сообщения, используя базу ответов cleverbot.com
2. Выполнять команды
3. Автоматически принимать заявки в друзья

##### Преимущества
1. Лёгкое добавление новых команд (см. [Добавление команд](#Добавление-своих-команд))
2. Лёгкое добавление новых условий парсинга входящий сообщений (см. [Добавление парсеров](#Добавление-своих-парсеров))

### Установка
    $ git clone git://github.com/olnaz/vkbot.git && cd vkbot && npm install


Также для работы модуля `node-ffprobe` придется установить `ffmpeg`  

    $ sudo apt-get install ffmpeg

### Настройка


#### Приложение ВКонтакте
Для работы бота, вам потребуется создать и настроить приложение ВКонтакте.  

##### Создание приложения
Перейдите по ссылке [vk.com/apps](http://vk.com/apps) и нажмите "Создать приложение".  
При создании приложения, необходимо указать тип "Standalone".

##### Создание методов
Перейдите в настройки созданного приложения, затем на вкладку "Хранимые процедуры".  
Скопируйте все методы из папки **__execute** в "Хранимые процедуры" вашего приложения.  

Название файла = название процедуры (не включая _.js_)  
Содержимое файла = код процедуры


#### Файл `start.js`
В файле `start.js` необходимо указать ID приложения, логин и пароль бота, а также API-key к сайту anti-captcha.com (если вы хотите, чтобы бот разгадывал капчу).


### Запуск
    $ npm start
    $ DEBUG=true npm start // debug-режим


### Добавление своих парсеров
Парсеры входящих сообщений находятся в папке **app/parsers**. На данный момент их три: _appeal.js_, _command.js_, _multichat-invite.js_.  

Парсеров может быть неограниченное количество, но ко входящему сообщению будет применен **первый**, подходящий под условие парсер.  
Для того, чтобы парсер начал использоваться приложением, достаточно просто поместить его в папку **app/parsers**.

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
