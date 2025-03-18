// Import axios for making HTTP requests
const axios = require('axios');

// Fetch exchange rates from the API
exports.fetchExchangeRates = async (req, res) => {
    // Get base currency from query parameter or default to USD
    const baseCurrency = req.query.base || 'USD';
    const apiKey = process.env.API_KEY;
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;

    try {
        // Log request reached the server
        console.log(`Server-Side fetch request reached for ${baseCurrency}`);

        // Send request to exchange rate API
        const response = await axios.get(url);

        // Log success and return API data to client
        console.log(`Sending exchange rate data for ${baseCurrency}`);
        res.json(response.data);

    } catch (error) {
        console.error("Exchange Rate API Error:", error.message);

        if (error.response) {
            // API responded with error status
            console.error("API Response Error Details:", {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            });

            const apiErrorMessage = error.response.data['error-type'] || "Unexpected API response error.";

            // Handle different API error statuses
            switch (error.response.status) {
                case 400:
                    return res.status(400).json({ message: "Bad request: " + apiErrorMessage });
                case 401:
                    return res.status(401).json({ message: "Unauthorized: Invalid API key." });
                case 403:
                    return res.status(403).json({ message: "Forbidden: Access denied to the requested resource." });
                case 404:
                    return res.status(404).json({ message: "Not found: The requested resource could not be found." });
                case 429:
                    return res.status(429).json({ message: "Too many requests: Rate limit exceeded." });
                case 500:
                    return res.status(500).json({ message: "Internal server error from API provider." });
                case 503:
                    return res.status(503).json({ message: "Service unavailable: API provider is currently unreachable." });
                default:
                    return res.status(error.response.status).json({ message: "API error: " + apiErrorMessage });
            }
        } else if (error.request) {
            // Request sent, no response received
            console.error("No response received from the API.");
            return res.status(503).json({ message: "No response from the exchange rate API. Please try again later." });
        } else {
            // Catch any unexpected server-side errors
            console.error("Unexpected error:", error);
            return res.status(500).json({ message: "Unexpected server error. Please try again later." });
        }
    }
};
