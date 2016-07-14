'use strict';
const express = require('express');
const fs = require('fs');
const Promise = require('bluebird');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './tmp/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now())
    }
})

const upload = multer({
    storage: storage
})

const router = express.Router();

router.use(upload.single('file'), (req, res, next) => {
    req.fileUpload = function() {
        return new Promise((resolve, reject) => {
            fs.readFile(req.file.path, 'utf8', (err, data) => {
                if (err) {
                    reject({
                        error: err
                    });
                } else {
                    resolve({
                        body: data,
                        documentPath: req.file.path,
                        insert: req.body.insert
                    });
                }
            });
        });
    }

    return next();
});


module.exports = router;
