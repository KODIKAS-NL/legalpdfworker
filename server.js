'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const log = require('./lib/logger');
const routes = require('./routes');
const fileUpload = require('./middleware/fileUpload');
const ElectronPDF = require('electron-pdf');

const app = express();

app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.text({ type: 'text/html', limit: '50mb'}));
app.use(bodyParser.raw({ type: 'image/*', limit: '50mb'}));
app.use('/convert', fileUpload);

// Routes
app.use('/', routes);
app.use((req, res) => {
  res.send(404, 'Not found');
});
const exporter = new ElectronPDF();
app.set('exporter', exporter);

const port = process.env.PORT || 3000;

// create server and set listening port
exporter.on('charged', () => {
  const server = app.listen(port, () => {
    log.info(`Legal Converter listening on port ${server.address().port}`);
    console.log('Started');
  });
});
exporter.start();

module.exports = app;
