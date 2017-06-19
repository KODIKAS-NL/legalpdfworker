'use strict';
const Promise = require('bluebird');
const log = require('../lib/logger');
const FileHelper = require('../lib/filehelper');
const fs = require('fs');

const convertHTML2PDF = (htmlPage, type, exporter) =>
  new Promise((resolve, reject) => {
    const options = {
      pageSize: 'A4',
      printBackground: true,
      marginsType: 1
    };

    if (!FileHelper.isImage(type)) {
      options.marginsType = 0;
    }

    fs.writeFile('input.html', htmlPage, (err) => {
      if (err) {
        return reject(err);
      }

      exporter.createJob('input.html', 'output.pdf', options, {}).then(job => {
        job.on('job-complete', () => {
          const rs = fs.createReadStream('output.pdf');
          resolve(rs);
        })
        job.render();
      }).catch((error) => {
        reject(error);
      });
    });
  });

exports.convert = (data, documentPath, type, exporter, res) => {
  convertHTML2PDF(data, type, exporter).then((stream) => {
    res.writeHead(200, { // eslint-disable-line
      'Content-Type': 'application/pdf',
      'Access-Control-Allow-Origin': '*',
      'Content-Disposition': 'attachment; filename="output.pdf"'
    });

    stream.pipe(res);
  }).catch((err) => {
    log.warn('Failed to convert document: ', err);
    res.status(415).end('Unable to convert the supplied document');
  });
};
