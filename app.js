require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io')
const Contenedor = require('./classes/Contenedor')
const Chat = require('./classes/Chat')
const apiRoutes = require('./api')
const getFakeProducts = require('./api/index');
const { generateProducts } = require('./utils/generateProducts');


const app = express();
const server = http.createServer(app);
const io = new Server(server);
const contenedor = new Contenedor('products');
const chat = new Chat('messages.json');

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.sendFile("index.html", { root: __dirname + '/public' });
});


io.on('connection', async (socket) => {
    //When user connects, we send him the chat history and product list
    const messages = await chat.getMessages();
    const products = await generateProducts(5);
    io.emit('full chat', messages )
    io.emit('full products', products )

    //When user sends a message, we save it in the chat history
    socket.on('chat message',async (message) => {
        const newMessage = {
            ...message,
            date: new Date()
        }
        io.emit('chat message', newMessage);
        await chat.saveMessage(newMessage);
    });

    socket.on('update products',async () =>{
        const products = await Contenedor.getProducts();
        io.emit('full products', products )
    })
})


server.listen(3000, () => {
    console.log('Server is running on port 3000');
})