const knownSymbols = {
    "AUD": "Australian Dollar",
    "CAD": "Canadian Dollar",
    "CLP": "Chilean Peso",
    "CNY": "Chinese Yuan",
    "EUR": "Euro",
    "GBP": "British Pound Sterling",
    "INR": "Indian Rupee",
    "JPY": "Japanese Yen",
    "RUB": "Russian Ruble",
    "USD": "United States Dollar",
    "ZAR": "South African Rand"
};

const historicalRates = {
    "AUD": {
        "CAD": 0.9069,
        "CLP": 89.7465,
        "CNY": 4.5678,
        "EUR": 0.6743,
        "GBP": 0.5432,
        "INR": 52.3456,
        "JPY": 89.2345,
        "RUB": 56.7890,
        "USD": 0.7123,
        "ZAR": 10.2345
    },
    "CAD": {
        "AUD": 1.1006,
        "CLP": 98.6754,
        "CNY": 5.0543,
        "EUR": 0.7432,
        "GBP": 0.6023,
        "INR": 57.6543,
        "JPY": 98.1234,
        "RUB": 62.4567,
        "USD": 0.7890,
        "ZAR": 11.3456
    },
    "CLP": {
        "AUD": 0.0111,
        "CAD": 0.0101,
        "CNY": 0.0504,
        "EUR": 0.0075,
        "GBP": 0.0060,
        "INR": 0.5823,
        "JPY": 0.0998,
        "RUB": 0.0632,
        "USD": 0.0081,
        "ZAR": 0.1154
    },
    "CNY": {
        "AUD": 0.2210,
        "CAD": 0.1979,
        "CLP": 19.8456,
        "EUR": 0.1468,
        "GBP": 0.1204,
        "INR": 11.4567,
        "JPY": 19.6754,
        "RUB": 12.4321,
        "USD": 0.1556,
        "ZAR": 2.2345
    },
    "EUR": {
        "AUD": 1.4842,
        "CAD": 1.3456,
        "CLP": 132.5678,
        "CNY": 6.8123,
        "GBP": 0.8089,
        "INR": 77.4567,
        "JPY": 131.7890,
        "RUB": 84.3210,
        "USD": 1.0543,
        "ZAR": 15.1901
    },
    "GBP": {
        "AUD": 1.8412,
        "CAD": 1.6543,
        "CLP": 175.2345,
        "CNY": 8.2456,
        "EUR": 1.2345,
        "INR": 94.6789,
        "JPY": 158.1234,
        "RUB": 101.4321,
        "USD": 1.4789,
        "ZAR": 18.8765
    },
    "INR": {
        "AUD": 0.0191,
        "CAD": 0.0173,
        "CLP": 1.7189,
        "CNY": 0.0873,
        "EUR": 0.0129,
        "GBP": 0.0105,
        "JPY": 0.5823,
        "RUB": 0.1098,
        "USD": 0.0137,
        "ZAR": 0.1956
    },
    "JPY": {
        "AUD": 0.0112,
        "CAD": 0.0101,
        "CLP": 10.0234,
        "CNY": 0.0504,
        "EUR": 0.0075,
        "GBP": 0.0061,
        "INR": 1.7189,
        "RUB": 0.0632,
        "USD": 0.011,
        "ZAR": 0.1154
    },
    "RUB": {
        "AUD": 0.0178,
        "CAD": 0.0161,
        "CLP": 15.7901,
        "CNY": 0.0806,
        "EUR": 0.0119,
        "GBP": 0.0098,
        "INR": 9.1345,
        "JPY": 15.8123,
        "USD": 0.0189,
        "ZAR": 0.1823
    },
    "USD": {
        "AUD": 1.4089,
        "CAD": 1.271,
        "CLP": 121.4567,
        "CNY": 6.4123,
        "EUR": 0.9487,
        "GBP": 0.8112,
        "INR": 72.9012,
        "JPY": 90.9876,
        "RUB": 52.8765,
        "ZAR": 14.0987
    },
    "ZAR": {
        "AUD": 0.0965,
        "CAD": 0.0873,
        "CLP": 8.6654,
        "CNY": 0.4523,
        "EUR": 0.0658,
        "GBP": 0.053,
        "INR": 5.1123,
        "JPY": 8.6854,
        "RUB": 5.4876,
        "USD": 0.0709
    }
};
// Utility functions
const renderOptions = (selectElement, defaultCurrency, options) => {
    options.sort().forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = `${currency} - ${knownSymbols[currency]}`;

        // Adding flag images
        const flagImg = document.createElement('img');
        flagImg.src = `/flags/${currency}.svg`;
        flagImg.alt = `${currency} flag`;
        flagImg.style = 'width: 16px; height: 16px; margin-right: 5px; vertical-align: middle;';

        option.prepend(flagImg);
        option.selected = currency === defaultCurrency;
        selectElement.appendChild(option);
    });
};

const displayError = (errorMessageEl, message) => {
    errorMessageEl.textContent = message;
    errorMessageEl.classList.add('visible');
};

const clearErrorMessage = (errorMessageEl) => {
    errorMessageEl.textContent = '';
    errorMessageEl.classList.remove('visible');
};



// Event handlers
const updateFlag = (selectElement, flagElementId) => {
    const selectedCurrency = selectElement.value;
    const flagElement = document.getElementById(flagElementId);
    flagElement.src = `../flags/${selectedCurrency}.svg`; 
};

const handleCurrencyChange = (selectElement, symbolElement) => {
    selectElement.addEventListener('change', () => {
        updateFlag(selectElement, selectElement.id + '-flag');
    });
};

const handleSubmit = (formEl, resultEl, errorMessageEl) => {
    formEl.addEventListener('submit', async (e) => {
        console.log("Generate Chart Clicked");
        e.preventDefault();
        clearErrorMessage(errorMessageEl);

        const fromCurrency = formEl.elements.from.value;
        const toCurrency = formEl.elements.to.value;

        // Check if the selected currencies are the same
        if (fromCurrency === toCurrency) {
            console.error('Error: Base and target currencies are the same');
            displayError(errorMessageEl, 'Please select different currencies for conversion.');
            return; // Exit the function if the same currency is selected
        }

        try {
            console.log(`Sending request to server for base currency: ${fromCurrency}`);
            const response = await fetch(`/api/currency-converter?base=${fromCurrency}`);
            if (!response.ok) {
                throw new Error('Error fetching current exchange rates');
            }

            const currentData = await response.json();
            console.log(`Received exchange rates from server for base ${fromCurrency}:`, response)
            if (!currentData.conversion_rates || !currentData.conversion_rates[toCurrency]) {
                throw new Error('Current exchange rate data is missing or incomplete');
            }

            const currentRate = currentData.conversion_rates[toCurrency];
            const historicalRate = historicalRates[fromCurrency][toCurrency];

            // Console log to check the historical value
            console.log(`Looking up historical rate for ${fromCurrency} to ${toCurrency}`);
            console.log(`Historical Rate Found: ${historicalRate}`);

            if (!historicalRate) {
                console.error('Error: Missing historical exchange rate data');
                displayError(errorMessageEl, 'Historical exchange rate data is missing or incomplete');
                return;
            }

            console.log(`Current exchange rate from ${fromCurrency} to ${toCurrency}: ${currentRate}`);
            console.log(`Historical exchange rate from ${fromCurrency} to ${toCurrency}: ${historicalRate}`);

            // Generate and display the chart as a table
            generateAndDisplayChart(fromCurrency, toCurrency, historicalRate, currentRate);

        } catch (error) {
            console.error('Fetch error:', error);
            displayError(errorMessageEl, error.message || 'Error performing conversion');
        }
    });
};

// Generate Historical Currency Chart
function generateAndDisplayChart(fromCurrency, toCurrency, historicalRate, currentRate) {
    // Format the rates to two decimal places for display
    const formattedCurrentRate = parseFloat(currentRate).toFixed(2);
    const formattedHistoricalRate = parseFloat(historicalRate).toFixed(2);
    // Get current date and time
    const currentDate = new Date();
    const currentDateString = currentDate.toLocaleDateString() + ' ' + currentDate.toTimeString().split(' ')[0];

    // Calculate historical date (one year ago)
    const historicalDate = new Date(currentDate);
    historicalDate.setFullYear(historicalDate.getFullYear() - 1);
    const historicalDateString = historicalDate.toLocaleDateString();

    // Average rate
    const averageRate = ((parseFloat(currentRate) + parseFloat(historicalRate)) / 2).toFixed(2); 
    const chartDataElement = document.getElementById('chart-data');

    // Clear any existing data
    chartDataElement.innerHTML = '';

    // Append rows with class names
    chartDataElement.innerHTML += `<tr class="chart-header"><td>Current Rate (${currentDateString})</td><td>1 ${fromCurrency} = ${formattedCurrentRate} ${toCurrency}</td></tr>`;
    chartDataElement.innerHTML += `<tr class="chart-row"><td>Historical Rate (${historicalDateString})</td><td>1 ${fromCurrency} = ${formattedHistoricalRate} ${toCurrency}</td></tr>`;
    chartDataElement.innerHTML += `<tr class="chart-row"><td>Average Rate</td><td>1 ${fromCurrency} = ${averageRate} ${toCurrency}</td></tr>`;

    // Display the reset button
    const resetButton = document.getElementById('resetButton');
    resetButton.style.display = 'block';
}

// Initial setup
const init = () => {
    const fromSelectEl = document.querySelector('#from');
    const toSelectEl = document.querySelector('#to');
    const formEl = document.querySelector('form');
    const resultEl = document.querySelector('#result');
    const errorMessageEl = document.getElementById('error-message');
    const resetButton = document.getElementById('resetButton');
    resetButton.style.display = 'none';

    valuesForSwitch(fromSelectEl, toSelectEl); // pass varibles

    // Populate dropdowns with currencies and set default values
    populateDropdown(fromSelectEl, Object.keys(knownSymbols), 'USD');
    populateDropdown(toSelectEl, Object.keys(knownSymbols), 'EUR');

    updateFlag(fromSelectEl, 'from-flag');
    updateFlag(toSelectEl, 'to-flag');

    handleCurrencyChange(fromSelectEl);
    handleCurrencyChange(toSelectEl);
    handleSubmit(formEl, resultEl, errorMessageEl);
};

const populateDropdown = (selectElement, currencies, defaultValue) => {
    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = `${currency} - ${knownSymbols[currency]}`;
        if (currency === defaultValue) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
};

document.addEventListener('DOMContentLoaded', init);

// Swap functionality
const valuesForSwitch = (fromSelectEl, toSelectEl) => {
    const switchButton = document.getElementById('switch-button');
    switchButton.addEventListener('click', async () => {
        console.log("Switch Clicked")
        let temp = fromSelectEl.value;
        fromSelectEl.value = toSelectEl.value;
        toSelectEl.value = temp;

        updateFlag(fromSelectEl, 'from-flag');
        updateFlag(toSelectEl, 'to-flag');
    });
};

// Reset button functionality
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', () => {
    // Clear the chart data
    const chartDataElement = document.getElementById('chart-data');
    chartDataElement.innerHTML = '';

    // Optionally, reset dropdowns to their default values
    const fromSelectEl = document.getElementById('from');
    const toSelectEl = document.getElementById('to');
    fromSelectEl.value = 'USD';
    toSelectEl.value = 'EUR';

    // Update flags for the reset dropdowns
    updateFlag(fromSelectEl, 'from-flag');
    updateFlag(toSelectEl, 'to-flag');

    // Hide the reset button
    resetButton.style.display = 'none';
});



document.addEventListener('DOMContentLoaded', init);




