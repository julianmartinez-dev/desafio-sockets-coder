const { Contenedor } = require("./Contenedor");
const express = require("express");


const router = express.Router();
const contenedor = new Contenedor("productos");


router
    .route('/products')
    .get(getAllProducts)
    .post(addProduct);



async function getAllProducts(req, res) {
    const products = await contenedor.obtenerProductos();
    res.json(products);
}

async function addProduct(req, res){
    const product = req.body;
    contenedor.guardarProducto(product);
    res.status(201).json(product);
}


module.exports = router;