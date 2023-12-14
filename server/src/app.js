const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/apiRoutes');
const cors = require('cors');
const initializeDatabase = require('./db/init.js');

const app = express();

const port = 3000;
app.use(cors());
app.use(bodyParser.json());

// Инициализация базы данных перед запуском сервера
initializeDatabase().then();

// Маршруты API
app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});

module.exports = app;
