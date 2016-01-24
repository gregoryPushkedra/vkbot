'use strict';

module.exports = {
  // Преобразует массив пользователей беседы в объект {id: name}
  chatUsersArrayToObj (array) {
    let obj = {};

    array.forEach(value => {
      obj[value.id] = value.first_name/* + ' ' + value.last_name*/;
    });

    return obj;
  }, 

  // Возвращает случайный элемент из массива
  randomElem (elemsArray) {
    return elemsArray[Math.floor(Math.random() * elemsArray.length)];
  }, 

  // Преобразует ответ сервера how-old.net в сообщение ВК
  facesToText (howOldResObject) {
    let facesArray = JSON.parse(JSON.parse(howOldResObject)).Faces;
    let message = '';

    if (facesArray.length === 0) 
      return 'На фото нет человеческого лица.';

    facesArray.forEach(v => {
      let face = v.attributes;
      let gender = { 'Female': '👩 Женщина', 'Male': '👨 Мужчина' };

      message += gender[face.gender] + ', возраст ' + face.age + '\n';
    });

    return message;
  }, 

  // Кодирует параметры запроса
  encodeParams (obj) {
    for (let key in obj) 
      obj[key] = encodeURIComponent(obj[key]);

    return obj;
  }
}
