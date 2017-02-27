'use strict';
const express = require('express');
const multer = require('multer');
const uuid = require('uuid');
const FileHelper = require('../lib/filehelper');
const os = require('os');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
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
  if (req.file && !FileHelper.isSupportedFileType(req.file.mimetype)) {
    return res.status(415).send('Unsupported file type');
  }

  return next();
});

module.exports = router;
