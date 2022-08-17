const Contenedor = require('../classes/Contenedor');
const express = require("express");


const router = express.Router();

router
    .route('/products')
    .get(getAllProducts)
    .post(addProduct);



async function getAllProducts(req, res) {
    const products = await Contenedor.getProducts();
    res.json(products);
}

async function addProduct(req, res){
    const product = req.body;
    await Contenedor.saveProduct(product);
    res.status(201).json(product);
}


module.exports = router;