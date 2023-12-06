const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Lowest level of logs to record
  format: winston.format.json(), // Format logs as JSON
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors to error.log
    new winston.transports.File({ filename: 'combined.log' }), // Log all logs to combined.log
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(), // Simple format for console logs
  }));
}

module.exports = logger;
