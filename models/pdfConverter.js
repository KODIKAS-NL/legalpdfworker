'use strict';
const pdf = require('html-pdf');
const Promise = require('bluebird');
const log = require('../lib/logger');
const FileHelper = require('../lib/filehelper');

const convertHTML2PDF = (htmlPage, type) =>
  new Promise((resolve, reject) => {
    const options = {};

    if (!FileHelper.isImage(type)) {
      options.border = {
        top: '2.5cm',
        right: '2.5cm',
        bottom: '2.5cm',
        left: '2.5cm'
      };
    }

    log.debug(`Creating pdf from html`);

    pdf.create(htmlPage, options).toStream((error, res) => {
      if (error) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });

exports.convert = (data, documentPath, type, res) => {
  convertHTML2PDF(data, type).then((stream) => {

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');

    log.debug('Streaming pdf');

    stream.pipe(res);
  }).catch((err) => {
    log.warn('Failed to convert document: ', err);
    res.status(415).end('Unable to convert the supplied document');
  });
};
