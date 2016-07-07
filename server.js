'use strict';
const bodyParser = require('body-parser');
const config = require('./config/proxy-configuration.json');
const express = require('express');
const log = require('winston');
const routes = require('./routes');
const fileUpload = require('./middleware/fileUpload');

const app = express();

app.use(bodyParser.text({
  type: 'text/html'
}));
app.use(fileUpload);

//Routes
app.use('/', routes);
app.use((req, res) => {
  res.send(404, 'Not found');
});

//create server and set listening port
const server = app.listen(config.Legal_Proxy_Converter_Listener_Port, () => {
  log.info(`Legal Converter listening on port  ${ server.address().port}`);
});

module.exports = app;
