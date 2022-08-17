const { options } = require('../options/mariaDB');
const knex = require('knex')(options);


class Contenedor {
  constructor(fileName = '', dbOptions = {}) {
    this.fileName = fileName;
    this.createTable(fileName);
  }
  
  async createTable(tableName = 'products') {
      
    try {
       const tableExists = await knex.schema.hasTable(tableName);
         if(tableExists){
              console.log(`Table ${this.fileName} already exits`);
              return;
         } 
      await knex.schema.createTable(tableName, (table) => {
        table.increments('id').primary();
        table.string('title');
        table.integer('price');
        table.string('thumbnail');
      });
      console.log(`Table ${this.fileName} created`);
    } catch (error) {
      console.log(error);
    }
  }

  static async saveProduct(product) {
    const { title, price, thumbnail } = product;
    try {
      await knex('products').insert({ title, price, thumbnail });
      console.log('product saved');
    } catch (error) {
      console.log(error);
    }
  }

  static async getProducts() {
    try {
      const products = await knex.select('*').from('products');
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}



module.exports = Contenedor;