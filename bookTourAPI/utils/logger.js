const morgan = require('morgan');

/**
 * Returns a Morgan HTTP request logger middleware configured
 * for the current environment.
 */
const requestLogger = () => {
  if (process.env.NODE_ENV === 'development') {
    return morgan('dev');
  }
  return morgan('combined');
};

module.exports = requestLogger;
