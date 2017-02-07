'use strict';
const pdf = require('html-pdf');
const Promise = require('bluebird');
const uuid = require('uuid');
const fileSystem = require('fs');
const log = require('../lib/logger');
const options = {
  border: {
    top: '2.5cm',
    right: '2.5cm',
    bottom: '2.5cm',
    left: '2.5cm'
  }
};

const convertHTML2PDF = (htmlPage) =>
  new Promise((resolve, reject) => {
    pdf.create(htmlPage, options).toFile(`./tmp/${uuid.v4()}.pdf`, (error, res) => {
      if (error) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });

exports.convert = (data, documentPath, res) => {
  convertHTML2PDF(data).then((output) => {
    res.writeHead(200, { // eslint-disable-line
      'Content-Type': 'application/pdf',
      'Access-Control-Allow-Origin': '*',
      'Content-Disposition': 'attachment; filename="output.pdf"'
    });

    const readStream = fileSystem.createReadStream(output.filename);
    readStream.pipe(res);

    // deleting the file once everything has been sent
    readStream.on('close', () => {
      fileSystem.unlink(output.filename);
      if (documentPath !== '') {
        fileSystem.unlink(documentPath);
      }
    });
  }, (err) => {
    log.warn('Failed to convert document: ', err);
    res.status(415).end('Unable to convert the supplied document');
  });
};
