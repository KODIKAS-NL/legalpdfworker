require('winston-transport-rollbar').Rollbar; // eslint-disable-line
const winston = require('winston');
const config = require('config');
const getEnv = require('./get-env');

const loglevel = config.has('loglevel') ? config.get('loglevel') : 'info';

const transports = [
  new (winston.transports.Console)({
    level: loglevel
  })
];

if (config.has('rollbar')) {
  transports.push(
    new (winston.transports.Rollbar)({
      level: loglevel,
      rollbarConfig:{
        accessToken: config.get('rollbar'),
        reportLevel:loglevel
      },
      environment: getEnv(),
      handleExceptions: true,
      exitOnError: false
    })
  );
}
const logger = new (winston.Logger)({
  transports,
  exitOnError: false
});

module.exports = logger;
