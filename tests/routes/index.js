'use strict';
const app = require('../../server');
const request = require('supertest');
const should = require('should');
const mocha = require('mocha');

describe('Convert', function() {
  describe('POST /convert', function() {

    it('should convert html payload and return pdf document', function(done) {
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
            err.should.be.null;
            return console.log(err);
          }
          res.should.be.not.null;
          res.header['content-disposition'].should.match(/.*\.pdf/)
          done();
        });
    });

    it('should html file and return pdf document', function(done) {
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

          res.header['content-disposition'].should.match(/.*\.pdf/)

          done();
        });
    });
  });

  describe('GET /', () => {

    it('should return service info', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .end((err, res) => {

          if (err) {
            err.should.be.null;
            return console.log(err);
          }
          const info = res.body;
          info.should.be.an.Object;
          info.should.have.property('description', 'Document to PDF conversion');
          done();
        });
    });
  });
});
