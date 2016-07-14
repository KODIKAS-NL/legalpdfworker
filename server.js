'use strict';
const bodyParser = require('body-parser');
const config = require('./config/proxy-configuration.json');
const express = require('express');
const log = require('winston');
const routes = require('./routes');
const fileUpload = require('./middleware/fileUpload');
const multiplefileUpload = require('./middleware/multipleFileUpload');

log.add(log.transports.File, {
    filename: config.Legal_Proxy_Converter_Log_File_Name
});
log.remove(log.transports.Console);

const app = express();

app.use(bodyParser.text({
    type: 'text/html'
}));
app.use('/convert',fileUpload);
app.use('/embed',multiplefileUpload);

//Routes
app.use('/', routes);

//create server and set listening port
const server = app.listen(config.Legal_Proxy_Converter_Listener_Port, () => {
    log.info(`Legal Converter listening on port  ${ server.address().port}`);
})

module.exports = app;
