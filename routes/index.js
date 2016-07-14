'use strict';
const converter = require('../models/pdfConverter');
const express = require('express');
const fileSystem = require('fs');
const router = express.Router();
const log = require('winston');


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

router.post('/embed', (req, res) => {
    //checking if content-type is text/html if not sends error message
    let contentType = req.get('Content-Type');
    if (contentType.indexOf('multipart/form-data')) {
        return res.status(415).end('Unable to convert the supplied document');
    }
    req.multiplefileUpload().then((data) => {
        converter.editPDF(data.files, data.insert).then((data)=>{
          res.writeHead(200, {
              'Content-Type': 'application/pdf',
              'Access-Control-Allow-Origin': '*',
              'Content-Disposition': 'attachment; filename="output.pdf"'
          });
          let readStream = fileSystem.createReadStream(data.PDFFile);
          readStream.pipe(res);
          //deleting the file once everything has been sent
          readStream.on('close', () => {
              data.files.forEach((file) => {
                  fileSystem.unlink(file.path);
              });
          });
        }).catch((e) => {
            log.error(e);
            return res.status(415).end('Unable to convert the supplied document');
        })
    }).catch((e) => {

        log.error(e);
        return res.status(415).end('Unable to convert the supplied document');
    });

});

router.get('/', (req, res) => {
    return res.json({
        name: "legalthings/pdfworker",
        version: version,
        description: "Document to PDF conversion",
        env: "prod.example",
        url: "http://pdfworker.example"
    });
});

module.exports = router;
