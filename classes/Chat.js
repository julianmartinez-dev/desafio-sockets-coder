const fs = require('fs');
const { schema } = require('normalizr');
const normalize = require('../normalizr/index.js')

class Chat {
  constructor(fileName = '') {
    this.fileName = fileName;
  }
  async saveMessage(message = {}) {
    //Get messages from .json file
    const messages = JSON.parse(fs.readFileSync(this.fileName, 'utf-8') || '[]');
    //Add a new one
    messages.push(message);
    try {
      //Save messages to .json file
      fs.writeFileSync(this.fileName, JSON.stringify(messages), null, 2);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getMessages() {
    try {
      //Get messages from .json file
      const messages = JSON.parse(fs.readFileSync(this.fileName, 'utf-8') || "[]")

      //Normalize messages
      const authorSchema = new schema.Entity("author", {}, { idAttribute: "email" });
      const messageSchema = new schema.Entity("messages",{
        author: authorSchema
      },{ idAttribute: "id" });
      const normalizedMessages = normalize( messages, [messageSchema] );

      //Return normalized messages
      return normalizedMessages;

    } catch (error) {
      throw new Error(error);
    }
  }

}

module.exports = Chat;