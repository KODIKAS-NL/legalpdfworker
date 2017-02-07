'use strict';
const converter = require('../models/pdfConverter');
const express = require('express');
const router = express.Router(); // eslint-disable-line
const version = require('../package.json').version;
const getEnv = require('../lib/get-env');

router.post('/convert', (req, res) => {
  // checking if content-type is text/html if not sends error message
  const contentType = req.get('Content-Type');
  if (contentType !== 'text/html' && contentType.indexOf('multipart/form-data')) {
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

router.get('/', (req, res) => {
  res.json({
    name: 'legalthings/pdfworker',
    version,
    description: 'Document to PDF conversion',
    env: getEnv()
  });
});

module.exports = router;
