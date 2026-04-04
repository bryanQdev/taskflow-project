const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const PORT = process.env.PORT;

if(!PORT){
    throw new Error('El puerto no está definido. Revisa tu archivo .env');
}

module.exports = { PORT };