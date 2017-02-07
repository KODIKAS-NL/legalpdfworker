require('winston-rollbar').Rollbar; // eslint-disable-line
const winston = require('winston');
const config = require('config');
const getEnv = require('./get-env');

const loglevel = config.get('loglevel') || 'info';

const transports = [
  new (winston.transports.Console)({
    level: loglevel,
    exitOnError: false
  })
];

if (config.has('rollbar')) {
  transports.push(
    new (winston.transports.Rollbar)({
      level: loglevel,
      rollbarAccessToken: config.get('rollbar'),
      environment: getEnv()
    })
  );
}
const logger = new (winston.Logger)({
  transports
});

module.exports = logger;
