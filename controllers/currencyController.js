// API call for exchange rate info
const axios = require('axios');

exports.fetchExchangeRates = async (req, res) => {
    const baseCurrency = req.query.base || 'USD';
    const apiKey = process.env.API_KEY;
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;

    try {
        console.log(`Server-Side fetch request reached for ${baseCurrency}`);
        const response = await axios.get(url);
        console.log(`Sending exchange rate data for ${baseCurrency}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        res.status(500).json({ message: 'Error fetching exchange rates' });
    }
};
