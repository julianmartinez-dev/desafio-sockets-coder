const normalizr = require('normalizr');

const authorSchema = new normalizr.schema.Entity('authors');
const messageSchema = new normalizr.schema.Entity(
    'messages', 
    { author: authorSchema },
    { idAttribute: 'id' }
)
const fileSchema = [messageSchema];

const normalizeMsg = ( message ) => {
    const normalizedMessage = normalizr.normalize(message, fileSchema);
    return normalizedMessage;
}

module.exports = normalizeMsg;