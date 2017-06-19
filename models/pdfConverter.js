'use strict';
const Promise = require('bluebird');
const log = require('../lib/logger');
const FileHelper = require('../lib/filehelper');
const fs = require('fs');
const hyperid = require('hyperid')({ urlSafe: true });

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

    const inputFile = `${hyperid()}.html`;
    const outputFile = `${hyperid()}.pdf`;

    fs.writeFile(inputFile, htmlPage, (err) => {
      if (err) {
        return reject(err);
      }

      exporter.createJob(inputFile, outputFile, options, {}).then(job => {
        job.on('job-complete', () => {
          fs.unlink(inputFile, (delErr) => {
            if (delErr) {
              log.warn('Failed to delete inputFile', inputFile);
            }
            log.debug(`Deleted input file: ${inputFile}`);
            const rs = fs.createReadStream(outputFile);
            resolve(rs);

            rs.on('end', () => {
              fs.unlink(outputFile, () => {
                log.debug(`Deleted output file: ${outputFile}`);
              });
            });
          });
        });
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
