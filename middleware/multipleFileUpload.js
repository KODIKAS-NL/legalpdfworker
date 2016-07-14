'use strict';
const express = require('express');
const fs = require('fs');
const Promise = require('bluebird');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './tmp/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now())
    }
})

const upload = multer({
    storage: storage,
    //filter the uploaded files, accepts pdf files and jpeg images only(png images are not supported by hummusjs)
    fileFilter: (req, file, cb) => {
        if (file.fieldname == 'file' && (file.mimetype == 'application/pdf' || file.mimetype == 'image/jpeg'))
            cb(null, true);
        else {
            cb(null, false)
        }
    }
});

const router = express.Router();

router.use(upload.any(), (req, res, next) => {
    req.multiplefileUpload = () => {
        return new Promise((resolve, reject) => {
            if (req.files.length < 1) {
                reject({
                    error: "no files sent"
                });
            } else {
                resolve({
                    files: req.files,
                    insert: req.body.insert
                });
            }
        });
    }

    return next();
});


module.exports = router;
