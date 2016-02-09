'use strict';

module.exports = messageObj => {
  return {
    isAdmin: messageObj.fromId === 'adminID'
  }
}
