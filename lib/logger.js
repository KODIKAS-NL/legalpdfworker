require('winston-rollbar').Rollbar;
const winston = require('winston');
const config = require('config');

const loglevel = config.get('loglevel') || 'info';

const transports = [
  new (winston.transports.Console)({
    level: loglevel
  })
];

if (config.has('rollbar')) {
  transports.push(
    new (winston.transports.Rollbar)({
      level: loglevel,
      rollbarAccessToken: config.get('rollbar')
    })
  );
}
const logger = new (winston.Logger)({
  transports: transports
});

module.exports = logger;