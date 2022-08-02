
const socket = io.connect();

//-------------CHAT-----------------//
const input = document.querySelector('#input-message');
const form = document.querySelector('#form-message');
const messageList = document.querySelector('#messages');
const userID = document.querySelector('#user-id');

//-------------PRODUCTS-----------------//
const table = document.querySelector('#table');
const formProduct = document.querySelector('#form-product');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const message = input.value;
    const user = userID.value;

    emitNewMessage({ user, message });
})

formProduct.addEventListener('submit', function(e) {
    e.preventDefault();
    const productData = {
      title: formProduct[0].value,
      price: formProduct[1].value,
      thumbnail: formProduct[2].value,
    };

    //Validate if all fields are filled
    if(Object.values(productData).includes('')) return
    
   fetch('/api/products', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(productData)
    })
    .then(res => res.json())
    .then(data => emitNewProduct() )
    
})

socket.on('chat message', function(msg){
    //Create a new message element with the message, user and date
    let message = document.createElement('li');
    message.innerHTML = `<p><span class="text-blue">${msg.user}</span> [<span class="text-brown">${formatDate(msg.date)}</span>] <span class="text-green">${msg.message}</span></p>`;

    //Append the message to the messageList list
    messageList.appendChild(message);
    messageList.scrollTop = messageList.scrollHeight;
})

socket.on('full chat', function(messages){

    messages.forEach(function(msg){
        let message = document.createElement('li');
        message.innerHTML = `<p><span class="text-blue">${msg.user}</span> <span class="text-brown">[${formatDate(msg.date)}]</span> : <span class="text-green">${msg.message}</span></p>`;

        messageList.appendChild(message);
        messageList.scrollTop = messageList.scrollHeight;
    })
})

socket.on('full products', function(products){
    fetch('/table.hbs')
    .then( resp => resp.text())
    .then( template => {
        const compiled = Handlebars.compile(template)
        const html = compiled({ products, productsExist: products.length > 0 })
        table.innerHTML = html
        table.scrollTop = table.scrollHeight;
    })
});


//-------------FUNCTIONS-----------------//
const emitNewMessage = ({ user, message }) => {
    if(!user || !message) return
    if(!validateEmail(user)) return


    socket.emit('chat message', {message, user});
    input.value = '';
}



const emitNewProduct = () => {
    socket.emit('update products', {});
    formProduct.reset();
}



//regex for email validation
const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const formatDate = (date) => {
    const dateFormatted = new Date(date)
    return dateFormatted.toLocaleString('es-AR')
    
}