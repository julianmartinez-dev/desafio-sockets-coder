const fs = require('fs')
const normalize = require('../normalizr/index.js')

class Chat {
  constructor(fileName = '') {
    this.fileName = fileName;
  }
  async saveMessage(message = {}) {
    const messages = await this.getMessages();
    messages.push(message);
    try {
      fs.writeFileSync(this.fileName, JSON.stringify(messages), null, 3);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getMessages() {
    try {
      const messages = fs.readFileSync(this.fileName, 'utf-8') || "[]";
      const normalizedData = normalize(JSON.parse(messages));
      console.log(normalizedData);
      return normalizedData;
    } catch (error) {
      throw new Error(error);
    }
  }

}

module.exports = Chat;