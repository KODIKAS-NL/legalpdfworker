'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const log = require('./lib/logger');
const routes = require('./routes');
const fileUpload = require('./middleware/fileUpload');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.text({ type: 'text/html', limit: '50mb' }));
app.use(bodyParser.raw({ type: 'image/*', limit: '50mb' }));
app.use('/convert', fileUpload);
app.use(errorHandler);

// Routes
app.use('/', routes);
app.use((req, res) => {
  res.status(404).send('Not found');
});

const port = process.env.PORT || 3000;

// create server and set listening port
const server = app.listen(port, () => {
  log.info(`Legal Converter listening on port ${server.address().port}`);
});

module.exports = app;
