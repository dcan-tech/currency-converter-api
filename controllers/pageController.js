// controllers/pageController.js

exports.renderHomePage = (req, res) => {
    res.render('home', { title: 'Home Page', currentPage: 'home' });
};

exports.renderCurrencyConverterPage = (req, res) => {
    res.render('currency-converter', { title: 'Currency Converter', currentPage: 'currency-converter' });
};

exports.renderCurrencyChartsPage = (req, res) => {
    res.render('currency-charts', { title: 'Currency Charts', currentPage: 'currency-charts' });
};
