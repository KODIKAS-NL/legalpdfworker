'use strict';
const express = require('express');
const fs = require('fs');
const Promise = require('bluebird');
const multer = require('multer');
const log = require('../lib/logger');
const uuid = require('uuid');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './tmp/');
  },
  filename: (req, file, cb) => {
    cb(null, uuid.v4());
  }
});

const upload = multer({
  storage
});

const router = express.Router(); // eslint-disable-line

router.use(upload.single('file'), (req, res, next) => {
  req.fileUpload = () => { // eslint-disable-line
    return new Promise((resolve, reject) => {
      fs.readFile(req.file.path, 'utf8', (err, data) => {
        if (err) {
          log.error('Read file err: ', err);
          reject({
            error: err
          });
        } else {
          resolve({
            body: data,
            documentPath: req.file.path
          });
        }
      });
    });
  };

  return next();
});

module.exports = router;
