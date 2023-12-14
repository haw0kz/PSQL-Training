// server/src/routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');

router.post('/executeQuery', queryController.executeQuery);
router.get('/getTables', queryController.getTables);
router.get('/getTables/:table', queryController.getTableByName);
router.post('/fillAllTables', queryController.fillAllTables);

module.exports = router;
