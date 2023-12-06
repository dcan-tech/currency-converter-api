require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
const logger = require('./logger');
const pageRoutes = require('./routes/pageRoutes'); 
const currencyRoutes = require('./routes/currencyRoutes');
const app = express();
const port = 3000;

// Middleware setup
app.use(helmet());
app.use(express.static('public'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
        write: message => logger.info(message.trim())
    }
}));

// Set view engine
app.set('view engine', 'ejs');

// Route to render the home page
app.get('/', (req, res) => {
    res.render('home', { title: 'Home Page', currentPage: 'home' });
});

// Route to render the currency converter page
app.get('/currency-converter', (req, res) => {
    res.render('currency-converter', { title: 'Currency Converter', currentPage: 'currency-converter' });
});

// Route to render the currency charts page
app.get('/currency-charts', (req, res) => {
    res.render('currency-charts', { title: 'Currency Charts', currentPage: 'currency-charts' });
});

app.use(pageRoutes);
app.use(currencyRoutes);

// 404 handling
app.use((req, res) => {
    logger.warn(`404 - Not Found - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(404).render('404', { title: 'Page Not Found' });
});

// Start the server
app.listen(port, () => logger.info(`Server running at http://localhost:${port}`));
