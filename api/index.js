const Contenedor = require('../classes/Contenedor');
const express = require("express");
const { generateProducts } = require('../utils/generateProducts');


const router = express.Router();

router
    .route('/products')
    .get(getAllProducts)
    .post(addProduct);

router
    .route('/products-test')
    .get(getFakeProducts);



async function getAllProducts(req, res) {
    const products = await Contenedor.getProducts();
    res.json(products);
}

async function addProduct(req, res){
    const product = req.body;
    await Contenedor.saveProduct(product);
    res.status(201).json(product);
}

async function getFakeProducts(req, res) {
    const products = generateProducts(5);
    res.json(products);
}
module.exports = router;