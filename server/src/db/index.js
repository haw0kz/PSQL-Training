
const pgp = require('pg-promise')();

const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'Education',
    user: 'postgres',
    password: '12345',
};

const db = pgp(dbConfig);



module.exports = db;
