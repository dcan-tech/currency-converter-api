const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');

router.get('/api/currency-converter', currencyController.fetchExchangeRates);

module.exports = router;