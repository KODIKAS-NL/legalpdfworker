'use strict';
const pdfConverter = require('../../models/pdfConverter');
const should = require('should');

describe('pdfConverter', () => {

    describe('#editPDF', () => {
        it('should edit a PDF file', () => {

            const files = [{
                fieldname: 'file',
                originalname: 'example.pdf',
                mimetype: 'application/pdf',
                filename: 'example.pdf',
                path: 'testexample.pdf',
            }, {
                fieldname: 'file',
                originalname: 'image.jpg',
                mimetype: 'image/jpeg',
                filename: 'image.jpg',
                path: 'testimage.jpg',

            }];

            const insertData = [{
                text: 'Hello world',
                page: '1',
                x: '200',
                y: '320',
                fontFamily: '',
                fontSize: '12'
            }, {
                page: '1',
                x: '0',
                y: '0',
                width: '100',
                height: '100',
                image: 'some/path/image.jpg'
            }];


            return pdfConverter.editPDF(files,insertData).then((pdfFile) => {
                pdfFile.should.not.be.null;
              
            });
        });
    });

});
