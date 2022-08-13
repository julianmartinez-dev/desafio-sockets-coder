const fs = require('fs')
const { options } = require('../options/mariaDB');
const knex = require('knex')(options);

class Chat {
  constructor(fileName = '') {
    this.fileName = fileName;
    this.createTable(fileName);
  }
  async createTable(tableName = 'messages') {
   try {
     if(knex.schema.hasTable(tableName)){
      console.log('Table already exits');
      return;
     }
     await knex.schema.createTable(tableName, (table) => {
       table.increments('id').primary();
       table.string('message');
       table.string('user');
       table.string('date');
     });
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
      const messages = await knex.select('*').from('messages');
      return messages;
    }catch(error) {
      console.log(error);
    }
  }
}

module.exports = Chat;