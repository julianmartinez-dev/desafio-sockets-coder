const express = require('express');
const http = require('http');
const { Server } = require('socket.io')
const { saveMessage } = require('./socket-server')
const { Chat, Contenedor } = require('./Contenedor')
const apiRoutes = require('./api')


const app = express();
const server = http.createServer(app);
const io = new Server(server);

const chat = new Chat('chat-messages');
const contenedor = new Contenedor('productos');

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.sendFile("index.html", { root: __dirname + '/public' });
});


io.on('connection', (socket) => {
    const messages = chat.obtenerMensajes();
    const products = contenedor.obtenerProductos();
    io.emit('full chat', messages )
    io.emit('full products', products )

    socket.on('chat message', ({ message, user}) => {
        const newMessage = {
            message,
            user,
            date: new Date(),
        }
        chat.guardarMensaje(newMessage);
        io.emit('chat message', newMessage);
    });

    socket.on('update products', () =>{
        const products = contenedor.obtenerProductos();
        io.emit('full products', products )
    })
})


server.listen(3000, () => {
    console.log('Server is running on port 3000');
})