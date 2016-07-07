'use strict';
const converter = require('../models/pdfConverter');
const express = require('express');
const router = express.Router();


router.post('/convert', (req, res) => {
    //checking if content-type is text/html if not sends error message
    let contentType = req.get('Content-Type');
    if (contentType != 'text/html' && contentType.indexOf('multipart/form-data')) {
        return res.status(415).end('Unable to convert the supplied document');
    }

    if (contentType === 'text/html') {
        converter.convert(req.body, '', res);
    } else {

        req.fileUpload().then((data) => {
            converter.convert(data.body, data.documentPath, res);
        });
    }

});

router.get('*', (req, res) => {
    res.status(200).end(JSON.parse(JSON.stringify('{"name": "legalthings/pdfworker",'+
                                                   '"version": "0.1.0",'+
                                                   '"description": "Document to PDF conversion",'+
                                                   '"env": "prod.example",'+
                                                   '"url": "http://pdfworker.example"}')));
});

module.exports = router;
