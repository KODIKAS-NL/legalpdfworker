'use strict';
const pdf = require('html-pdf');
const Promise = require('bluebird');
const uuid = require('uuid');
const options = {
    'border': {
        'top': '1cm',
        'right': '1cm',
        'bottom': '1cm',
        'left': '1cm'
    }
};

exports.convertHTML2PDF = (htmlPage) => {
    return new Promise((resolve, reject) => {
        pdf.create(htmlPage, options).toFile('./tmp/'+uuid.v4()+'.pdf', (error, res) => {
            if (error) {
                reject({
                    error: error
                });
            } else {
                resolve(res);
            }
        });
    });
}
