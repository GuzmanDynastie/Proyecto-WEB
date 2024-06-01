const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env'});

let db_url = process.env.DB_URL;
db_url = db_url.replace('<target>', process.env.TARGET_DB);
db_url = db_url.replace('<password>', process.env.DB_PWD);
db_url = db_url.replace('<user>', process.env.DB_USER);

let db_url_local = process.env.DB_URL_LOCAL;
db_url_local = db_url_local.replace('<target>', process.env.TARGET_DB);

const connectToDatabase = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log('Conexión exitosa a la base de datos en linea');
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error.message);
        if (uri === db_url) {
            console.log('Intentando conectar a la segunda base de datos... localhost');
            await connectToDatabase(db_url_local);
        }
    }
};

connectToDatabase(db_url);
console.log(db_url)