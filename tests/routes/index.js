'use strict';
const app = require('../../server');
const request = require('supertest');
const should = require('should');

describe('Tasks', () => {
    describe('POST /convert', () => {

        it('should return pdf document(sending html code in body)', function(done) {
            this.timeout(10000);
            request(app)
                .post('/convert')
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
    describe('POST /convert', () => {

        it('should return pdf document(sending html file)', function(done) {
            this.timeout(10000);
            request(app)
                .post('/convert')
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

    describe('POST /embed', () => {

        it('should return pdf document', (done) => {
            request(app)
                .post('/embed')
                .set({
                    'Content-Type': 'multipart/form-data'
                })
                .attach('file', 'testexample.pdf')
                .attach('insert[2][image]', 'testimage.jpg')
                .field('insert[1][text]', 'Hello world')
                .field('insert[1][page]', '1')
                .field('insert[1][x]', '250')
                .field('insert[1][y]', '320')
                .field('insert[1][fontFamily]', '')
                .field('insert[1][fontSize]', '20')
                .field('insert[2][page]', '1')
                .field('insert[2][x]', '600')
                .field('insert[2][y]', '20')
                .field('insert[2][width]', '150')
                .field('insert[2][height]', '150')
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

    describe('GET /', () => {

        it('should return system info', (done) => {
            request(app)
                .get('/')
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
