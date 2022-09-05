const faker = require('faker');
faker.locale = 'es'

//Function to generate x(count) products
const generateProducts = (count) => {
    const products = [];
    for (let i = 0; i < count; i++) {
        products.push({
          id: faker.datatype.number(),
          title: faker.commerce.productName(),
          price: faker.commerce.price(),
          thumbnail: faker.image.image(),
        });
    }
    return products;
}

module.exports = { generateProducts };