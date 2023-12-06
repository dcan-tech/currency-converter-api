// routes/pageRoutes.js

const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

router.get('/', pageController.renderHomePage);
router.get('/currency-converter', pageController.renderCurrencyConverterPage);
router.get('/currency-charts', pageController.renderCurrencyChartsPage);

module.exports = router;
