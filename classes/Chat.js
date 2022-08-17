const fs = require('fs')
const { options } = require('../options/sqliteDB');
const knex = require('knex')(options);

class Chat {
  constructor(fileName = '') {
    this.fileName = fileName;
    this.createTable(fileName);
  }
  async createTable(tableName = 'messages') {
   try {
    const tableExists = await knex.schema.hasTable(tableName);
     if (tableExists) {
       console.log(`Table ${this.fileName} already exits`);
       return;
     }
     await knex.schema.createTable(tableName, (table) => {
       table.increments('id')
       table.string('message');
       table.string('user');
       table.integer('date');
     });
     console.log(`Table ${this.fileName} created`);
   } catch (error) {
     console.log(error);
   } 

  }

  async saveMessage(msg = {}) {
    const { message, user, date } = msg;
    try {
      await knex('messages').insert({ message, user, date })
      console.log('message saved');
    } catch (error) {
      console.log(error);
    }
  }

  async getMessages() {
    try {
      const messages = await knex.from('messages').select('*');
      console.log(messages)
      return messages;
    }catch(error) {
      console.log(error);
    }
  }
}

module.exports = Chat;