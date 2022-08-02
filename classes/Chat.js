const fs = require('fs')

class Chat {
  constructor(fileName = '') {
    this.fileName = fileName + '.txt';

    if (!fs.existsSync(this.fileName)) {
      fs.writeFileSync(this.fileName, JSON.stringify([]));
    } else {
      console.log('El contenedor para los chat ya existe');
    }
  }

  saveMessage(message = {}) {
    const document = fs.readFileSync(this.fileName, 'utf8');
    const messageList = JSON.parse(document);

    messageList.push(message);

    fs.writeFileSync(this.fileName, JSON.stringify(messageList, null, 2));
  }

  getMessages() {
    const data = fs.readFileSync(this.fileName, 'utf8');
    return JSON.parse(data);
  }
}

module.exports = Chat;