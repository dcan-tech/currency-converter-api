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

function generateConversionTable(baseCurrency, targetCurrency, rate) {
    const increments = [1, 5, 50, 100, 500, 1000, 5000, 10000];
    let tableHtml = `<h3>Convert ${baseCurrency} to ${targetCurrency}</h3>`;
    tableHtml += '<table>';

    increments.forEach(inc => {
        const convertedValue = (inc * rate).toFixed(2);
        tableHtml += `<tr><td>${inc} ${baseCurrency}</td><td>${convertedValue} ${targetCurrency}</td></tr>`;
    });

    tableHtml += '</table>';
    return tableHtml;
}

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

const calculateExchange = (amount, exchangeRate) => {
    const result = amount * exchangeRate;
    return result.toFixed(2);
};

// Event handlers
const updateFlag = (selectElement, flagElementId) => {
    const selectedCurrency = selectElement.value;
    const flagElement = document.getElementById(flagElementId);
    flagElement.src = `/flags/${selectedCurrency.toUpperCase()}.svg`;

};

const handleCurrencyChange = (selectElement, symbolElement) => {
    selectElement.addEventListener('change', () => {
        updateFlag(selectElement, selectElement.id + '-flag');
    });
};

const handleSubmit = (formEl, resultEl, errorMessageEl) => {
    formEl.addEventListener('submit', async (e) => {
        console.log("Convert Clicked");
        e.preventDefault();
        clearErrorMessage(errorMessageEl);

        const amountValue = formEl.elements.amount.value;
        const fromCurrency = formEl.elements.from.value;
        const toCurrency = formEl.elements.to.value;

        console.log(`Form submitted with: Amount = ${amountValue}, From Currency = ${fromCurrency}, To Currency = ${toCurrency}`);

        // Validate input, must be positive and a valid number format
        if (!/^\d+(\.\d{0,2})?$/.test(amountValue)) {
            console.log('Error: Invalid amount format');
            displayError(errorMessageEl, 'Please enter a valid numeric amount');
            return;
        }

        const amount = parseFloat(amountValue);
        if (amount <= 0) {
            console.log('Error: Amount is not greater than 0');
            displayError(errorMessageEl, 'Please enter an amount greater than 0');
            return;
        }

        // Fetch exchange rates from the server
        try {
            console.log(`Sending request to server for base currency: ${fromCurrency}`);
            const response = await fetch(`/api/currency-converter?base=${fromCurrency}`);
        
            if (!response.ok) {
                throw new Error('Error fetching exchange rates');
            }
        
            const data = await response.json();
            console.log(`Received exchange rates from server for base ${fromCurrency}:`, data)

        
            if (!data.conversion_rates || !data.conversion_rates[toCurrency]) {
                throw new Error('Exchange rate data is missing or incomplete');
            }

            const rateFromTo = data.conversion_rates[toCurrency];
            console.log(`Exchange rate from ${fromCurrency} to ${toCurrency}: ${rateFromTo}`);

            const result = calculateExchange(amount, rateFromTo);
            console.log(`Calculated conversion: ${amountValue} ${fromCurrency} = ${result} ${toCurrency}`);


            // Update the result display
            resultEl.textContent = `${amount} ${fromCurrency} is equal to ${result} ${toCurrency}`;
            const resultsDiv = document.querySelector('.results');
            resultsDiv.classList.add('visible');

            // Generate and display conversion tables
            document.getElementById('tableFromTo').innerHTML = generateConversionTable(fromCurrency, toCurrency, rateFromTo);
            document.getElementById('tableToFrom').innerHTML = generateConversionTable(toCurrency, fromCurrency, 1 / rateFromTo);

        } catch (error) {
            console.error('Fetch error:', error);
            displayError(errorMessageEl, error.message || 'Error performing conversion');
        }
    });
};

// Initial setup
const init = () => {
    const fromSelectEl = document.querySelector('#from');
    const toSelectEl = document.querySelector('#to');
    const formEl = document.querySelector('form');
    const resultEl = document.querySelector('#result');
    const errorMessageEl = document.getElementById('error-message');

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
    // Directly access the elements within the reset functionality
    const resultEl = document.querySelector('#result'); // Replace '#result' with the correct ID if different
    const resultsDiv = document.querySelector('.results');
    const amountInput = document.getElementById('amount');
    const tableFromTo = document.getElementById('tableFromTo');
    const tableToFrom = document.getElementById('tableToFrom');

    // Clear the results and hide the results div
    resultEl.textContent = '';
    resultsDiv.classList.remove('visible');

    // Reset the amount field and clear the tables
    amountInput.value = '';
    tableFromTo.innerHTML = '';
    tableToFrom.innerHTML = '';
});


document.addEventListener('DOMContentLoaded', init);




