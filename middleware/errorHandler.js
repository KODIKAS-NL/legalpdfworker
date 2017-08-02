'use strict';
const logger = require('../lib/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.stack);
  next(err);
};
