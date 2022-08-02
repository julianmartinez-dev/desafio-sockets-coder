const fs = require('fs');

class Contenedor {
    constructor(fileName = ''){
        this.fileName = fileName + '.txt';

        if(!fs.existsSync(this.fileName)){
            fs.writeFileSync(this.fileName, JSON.stringify([]))
        }else{
            console.log('El contenedor para los productos ya existe')
        }
    }

    saveProduct(product){
        const document = fs.readFileSync(this.fileName, 'utf8');
        const productList = JSON.parse(document);

        productList.length
        ? product.id = productList[productList.length - 1].id + 1
        : product.id = 1;

        productList.push(product);

        fs.writeFileSync(this.fileName, JSON.stringify(productList, null, 2));
    }

    getProducts(){
        const data = fs.readFileSync(this.fileName, 'utf8');
        return JSON.parse(data);
    }

}



module.exports = Contenedor;