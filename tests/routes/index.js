'use strict';
const app = require('../../server');
const request = require('supertest');
const should = require('should');

describe('Tasks', () => {
    describe('POST /service/html2pdf', () => {

        it('should return pdf document', (done) => {
            request(app)
                .post('/service/html2pdf')
                .set({
                    'Content-Type': 'text/html'
                })
                .send('<p>This bit of HTML will be transformed into a <b>docx or pdf</b> file</p>')
                .expect(200)
                .end((err, res) => {

                    if (err) {
                        console.log(err);
                    }
                    res.should.be.not.null;
                    res.header['content-disposition'].should.match(/.*\.pdf/)
                    done();
                });
        });

    });
    describe('POST /service/file2pdf', () => {

        it('should return pdf document', (done) => {
            request(app)
                .post('/service/file2pdf')
                .set({
                    'Content-Type': 'multipart/form-data'
                })
                .attach('file', 'example.html')
                .expect(200)
                .end((err, res) => {

                    if (err) {
                        console.log(err);
                    }
                    res.should.be.not.null;
                    res.header['content-disposition'].should.match(/.*\.pdf/)

                    done();
                });
        });

    });

    describe('GET /service/pdfworker', () => {

        it('should return system info', (done) => {
            request(app)
                .get('/service/pdfworker')
                .expect(200)
                .end((err, res) => {

                    if (err) {
                        console.log(err);
                    }
                    res.should.be.not.null;
                    done();
                });
        });

    });
});
