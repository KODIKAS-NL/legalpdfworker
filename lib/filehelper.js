const Promise = require('bluebird');
const fs = require('fs');
const log = require('./logger');

class FileHelper {

  static readFile(file) {
    return new Promise((resolve, reject) => {
      const encoding = this.isImage(file.mimetype) ? null : 'utf8';
      fs.readFile(file.path, encoding, (err, data) => {
        if (err) {
          log.error('Read file err: ', err);
          return reject({
            error: err
          });
        }

        if (this.isImage(file.mimetype)) {
          const result = this.imageToHtml(new Buffer(data), file.mimetype, file.path);

          resolve(result);
        } else {
          resolve({
            body: data,
            documentPath: file.path,
            type: file.mimetype
          });
        }
      });
    });
  }

  static imageToHtml(data, mimetype, path) {
    let image = `data:${mimetype};base64,${data.toString('base64')}`;
    if (mimetype === 'image/svg+xml') {
      image = `data:${mimetype};utf8,${data}`;
    }

    const html =
      `<html>
            <style>
              img {
                max-width: 10.5in;
                max-height: 8in;
              }
            </style>
            <body>
              <img src='${image}'></img>
            </body>
          </html>`;

    return {
      body: html,
      documentPath: path,
      type: mimetype
    };
  }


  static isImage(mimeType) {
    const imageTypes = [
      'image/tiff',
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/svg+xml'
    ];

    return imageTypes.indexOf(mimeType) !== -1;
  }

  static isSupportedFileType(fileType) {
    const supportedFileTypes = [
      'image/tiff',
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/svg+xml',
      'text/html'
    ];

    return supportedFileTypes.indexOf(fileType) >= 0;
  }
}

module.exports = FileHelper;
