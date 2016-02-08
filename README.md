## Chatbot for VKontakte (vk.com)

Live example: [vk.com/chatsbot](http://vk.com/chatsbot)

##### Features
1. Replies to messages using cleverbot.com answers database.
2. Performs commands.
3. Accepts friend requests automatically.
4. Updates status automatically (prints actual bot state)
5. Easy adding new commands (see [Adding commands](#adding-commands))  
   Parsers (see [Adding parsers](#adding-parsers))  
   And middlewares.


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
    $ sudo pm2 start start.js --name vkbot -- -debug && sudo pm2 logs // for debugging


### Process monitoring
    $ sudo pm2 monit

PM2 documentation: [github.com/Unitech/pm2](https://github.com/Unitech/pm2)
    
After the first start `access_token` will be saved to **./token.json**.


### Adding parsers
Parsers are need for processing incoming messages and running certain script depending on the message body.  
They are in the **app/parsers** folder.

Amount of parsers isn't limited, but to the incoming message will be applied the **first** parser fit for condition.  
To force the app to use your parser, you need to put it into **app/parsers** folder.

Example:
```javascript
// app/parsers/example.js
'use strict';

module.exports = function (messageObj) {
  return {
    cond: messageObj.message.startsWith('@@@'), 
    fn: callback => {
      return callback({
        message: '@@@ Message to send', 
        forward: messageObj.isMultichat
      });
    }
  }
}
```

Each parser must export function that takes one argument `messageObj` and returns object with `cond` property and `fn` method.

`messageObj`:
* `_cleverbot` (Object): __Cleverbot__ instance.
* `_vkapi` (Object): __VKApi__ instance.
* `attachments` (Object): Message attachments. ([vk.com/dev/using_longpoll](http://vk.com/dev/using_longpoll))
* `botId` (Number)
* `chatId` (Number): `=== fromId` for tet-a-tet chats
* `chatUsers` (Object): Data format: _{userId: userFirstName}_
* `fromId` (Number): User ID (message owner)
* `isMultichat` (Boolean): _true_, if message has come in a multichat
* `message` (String): Message text
* `messageId` (Number): Message ID

`cond` - if `true`, this parser will be used.  
`fn` - callback-function that will be called if `cond === true`.

Inside the function `fn`, you must call `callback(Object)`-function, when all operations were done.

`Object`:
* `message` (String): Message to send
* `attachments` (String/Array of Strings): Message attachments (optional) [vk.com/dev/messages.send](https://vk.com/dev/messages.send)
* `forward` (Boolean): if _true_, the source message will be forwarded.


### Adding commands
All commands are in the **app/parsers/commands** folder.  
Files that name starts with "__" are "private" and can be used only inside the app.

To force the app to use your command, you need to put it into **app/parsers/commands** folder, add its description in the file **app/parsers/config/lang.js**, and specify aliases for it (optional) in the file **app/config/commands/__aliases.js**

Each command .js-file must export function that takes two arguments `arg` and `callback`.  
Inside the function, you must call `callback(Object)`-function, when all operations were done. (see [Adding parsers](#adding-parsers))

`arg` - arguments parser  
`callback` - callback-function (see [Adding parsers](#adding-parsers))

`arg` object methods:
* `firstWord()`: returns the first word
* `fullText()`: returns the full text
* `textAndNum()`: returns the array [text, number] or [text], if number was not specified
* `attachment(type)`: returns the array [attachment, messageId], or **null**
* `wholeObj()`: returns the source `messageObj` object

Example:
```javascript
// app/parsers/commands/example.js
'use strict';

module.exports = (arg, callback) => {
  let argText = arg.fullText();
  let VK = arg.wholeObj()._vkapi;
  
  let reply = ~argText.indexOf('example') ? 'Example message' : null;

  return callback({
    message: reply
  });
}
```


### About commands
Commands for personal messages and multichats are different.  
You can specify which commands are unique in the file **app/parsers/commands/__list.js**.
