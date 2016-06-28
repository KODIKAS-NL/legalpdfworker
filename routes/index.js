'use strict';
const converter = require('../models/pdfConverter');
const express = require('express');
const fileSystem = require('fs');
const router = express.Router();

router.post('*', (req, res) => {
    //checking if content-type is text/html if not sends error message
    let contentType = req.get('Content-Type');

    if (contentType != 'text/html') {
        return res.status(400).end('Wrong content-type, you can only send text/html');
    }

    let htmlPage = req.body;

    converter.convertHTML2PDF(htmlPage).then((data) => {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Access-Control-Allow-Origin': '*',
                'Content-Disposition': 'attachment; filename="output.pdf"'
            });
            let readStream = fileSystem.createReadStream(data.filename);
            readStream.pipe(res);
            //deleting the file once everything has been sent
            readStream.on('close', function () {
              fileSystem.unlink(data.filename);
             });
        },
        (error) => {
            res.status(400).end(error);
        });
});

module.exports = router;
