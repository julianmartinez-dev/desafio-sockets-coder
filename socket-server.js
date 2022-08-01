const fs = require('fs')

const saveMessage = ({message, user}) => {
  const data = {
    message,
    user,
    date: new Date(),
  };

  fs.appendFileSync('messages.json', JSON.stringify(data, null, 2)+ ',\n');
}

module.exports = {
    saveMessage
}