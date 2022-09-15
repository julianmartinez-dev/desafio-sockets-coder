const { denormalize, schema } = normalizr;
const socket = io.connect();

//-------------CHAT-----------------//
const formMessage = document.querySelector('#form-message');
const messageList = document.querySelector('#messages');
const userID = document.querySelector('#user-id');
const userName = document.querySelector('#user-name');
const useLastName = document.querySelector('#user-lastName');
const userAge = document.querySelector('#user-age');
const userAlias = document.querySelector('#user-alias');
const userAvatar = document.querySelector('#user-avatar');
const input = document.querySelector('#input-message');
const chatTitle = document.querySelector('#chat-title');

//-------------PRODUCTS-----------------//
const table = document.querySelector('#table');
const formProduct = document.querySelector('#form-product');

formProduct.addEventListener('submit', function (e) {
  e.preventDefault();
  const productData = {
    title: formProduct[0].value,
    price: formProduct[1].value,
    thumbnail: formProduct[2].value,
  };

  //Validate if all fields are filled
  if (Object.values(productData).includes('')) return;

  fetch('/api/products', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(productData),
  })
    .then((res) => res.json())
    .then((data) => emitNewProduct());
});

socket.on('full products', function (products) {
  fetch('/table.hbs')
    .then((resp) => resp.text())
    .then((template) => {
      const compiled = Handlebars.compile(template);
      const html = compiled({ products, productsExist: products.length > 0 });
      table.innerHTML = html;
      table.scrollTop = table.scrollHeight;
    });
});

//-------------CHAT-----------------//

formMessage.addEventListener('submit', function (e) {
  e.preventDefault();
  const newMessage = {
    author: {
      id: userID.value,
      name: userName.value,
      lastName: useLastName.value,
      age: userAge.value,
      alias: userAlias.value,
      avatar: userAvatar.value,
    },
    text: input.value,
    date: new Date(),
  };

  if (Object.values(newMessage.author).includes('') || newMessage.text === '') {
    alert('Complete todos los campos');
    return;
  }
  emitNewMessage(newMessage);
});

socket.on('chat message', function (msg) {
  const { author, text, date } = msg;
  const { name, lastName } = author;
  //Create a new message element with the message, user and date
  let message = document.createElement('li');
  message.innerHTML = `<p><span class="text-blue">${name} ${lastName}</span> <span class="text-brown">[${formatDate(
    date
  )}]</span> : <span class="text-green">${text}</span></p>`;

  //Append the message to the messageList list
  messageList.appendChild(message);
  messageList.scrollTop = messageList.scrollHeight;
});

socket.on('full chat', function (messages) {
  const authorSchema = new schema.Entity(
    'authors',
    {},
    { idAttribute: 'email' }
  );

  const messageSchema = new schema.Entity(
    'messages',
    {
      author: authorSchema,
    },
    { idAttribute: 'id' }
  );

  const denormalizedMessages = denormalize(
    messages.result,
    [messageSchema],
    messages.entities
  );

  denormalizedMessages.forEach(function (msg) {
    const { author, text, date } = msg;
    const { name, lastName } = author;
    let message = document.createElement('li');
    message.innerHTML = `<p><span class="text-blue">${name} ${lastName}</span> <span class="text-brown">[${formatDate(
      date
    )}]</span> : <span class="text-green">${text}</span></p>`;

    messageList.appendChild(message);
    messageList.scrollTop = messageList.scrollHeight;
  });

  //Show compression in chat title
   const compressed = calculateCompression(messages, denormalizedMessages);
    chatTitle.textContent += ` - Compresión: (${compressed}%)`;
});



//-------------FUNCTIONS-----------------//
const emitNewMessage = (message) => {
  socket.emit('chat message', message);
  input.value = '';
};

const emitNewProduct = () => {
  socket.emit('update products', {});
  formProduct.reset();
};

//regex for email validation
const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const formatDate = (date) => {
  const dateFormatted = new Date(date);
  return dateFormatted.toLocaleString('es-AR');
};


const calculateCompression = ( original = "", normalized = "") => {
  console.log(JSON.stringify(original).length)
  console.log(JSON.stringify(normalized).length)
  return (
    100 -
    (JSON.stringify(original).length / JSON.stringify(normalized).length) * 100
  ).toFixed(2);

}