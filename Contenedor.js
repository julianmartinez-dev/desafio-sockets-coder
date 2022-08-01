const fs = require('fs');

class Contenedor {
    constructor(fileName = ''){
        this.fileName = fileName + '.txt';

        if(!fs.existsSync(this.fileName)){
            fs.writeFileSync(this.fileName, JSON.stringify([]))
        }else{
            console.log('El contenedor para los productos')
        }
    }

    guardarProducto(producto){
        const document = fs.readFileSync(this.fileName, 'utf8');
        const listadoProductos = JSON.parse(document);

        listadoProductos.length
        ? producto.id = listadoProductos[listadoProductos.length - 1].id + 1
        : producto.id = 1;

        listadoProductos.push(producto);

        fs.writeFileSync(this.fileName, JSON.stringify(listadoProductos, null, 2));
    }

    obtenerProductos(){
        const data = fs.readFileSync(this.fileName, 'utf8');
        return JSON.parse(data);
    }

}

class Chat {
    constructor(fileName = ''){
        this.fileName = fileName + '.txt';

        if(!fs.existsSync(this.fileName)){
            fs.writeFileSync(this.fileName, JSON.stringify([]))
        }else{
            console.log('El contenedor para los chat ya existe')
        }
    }

    guardarMensaje(message = {}){
        const document = fs.readFileSync(this.fileName, 'utf8');
        const listadoMensajes = JSON.parse(document);

        listadoMensajes.push(message);

        fs.writeFileSync(this.fileName, JSON.stringify(listadoMensajes, null, 2));
    }

    obtenerMensajes(){
        const data = fs.readFileSync(this.fileName, 'utf8');
        return JSON.parse(data);
    }
}

module.exports = {
    Contenedor,
    Chat
}