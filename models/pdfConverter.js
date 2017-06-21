'use strict';
const Promise = require('bluebird');
const log = require('../lib/logger');
const FileHelper = require('../lib/filehelper');
const fs = require('fs');
const hyperid = require('hyperid')({ urlSafe: true });
const HTMLToPDF = require('html5-to-pdf');

const convertHTML2PDF = (htmlPage, type) =>
  new Promise((resolve, reject) => {
    const inputFile = `${hyperid()}.html`;
    const outputFile = `${hyperid()}.pdf`;
    const options = {
      options: {
        pageSize: 'A4',
        printBackground: true,
        marginsType: 1
      },
      inputPath: inputFile,
      outputPath: outputFile,
      renderDelay: 1000
    };

    if (!FileHelper.isImage(type)) {
      options.options.marginsType = 0;
    }

    fs.writeFile(inputFile, htmlPage, (err) => {
      if (err) {
        return reject(err);
      }

      const htmlToPDF = new HTMLToPDF(options);
      htmlToPDF.build((buildErr) => {
        if (buildErr) {
          return reject(err);
        }
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
    });
  });

exports.convert = (data, documentPath, type, res) => {
  convertHTML2PDF(data, type).then((stream) => {
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
