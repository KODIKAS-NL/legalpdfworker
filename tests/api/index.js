'use strict';
const app = require('../../server');
const request = require('supertest');
const fs = require('fs');
const should = require('should');

describe('Tasks', () => {

  describe('POST /convert', () => {
    it('should return pdf document(sending html code in body)', function(done) {
      this.skip();
      this.timeout(10000);
      setTimeout(() => {
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
      }, 5000)

    });
  });

  describe('POST /convert', () => {
    it('should return pdf document when sending an html file', function(done) {
      this.skip();
      this.timeout(10000);
      request(app)
        .post('/convert')
        .set({
          'Content-Type': 'multipart/form-data'
        })
        .attach('file', './tests/files/example.html')
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
    it('should return pdf document when sending png image', function(done) {
      this.skip();
      this.timeout(10000);
      request(app)
        .post('/convert')
        .set({
          'Content-Type': 'multipart/form-data'
        })
        .attach('file', './tests/files/example-image.png')
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
    it('should return pdf document when sending png image', function(done) {
      this.skip();
      this.timeout(10000);
      const data = fs.readFileSync('./tests/files/example-image.png');
      request(app)
        .post('/convert')
        .set({
          'Content-Type': 'image/png'
        })
        .send(data)
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
    it('should return pdf document when sending svg image', function(done) {
      this.timeout(10000);
      this.skip();
      const data = fs.readFileSync('./tests/files/example-image.svg');
      request(app)
        .post('/convert')
        .set({
          'Content-Type': 'image/svg+xml'
        })
        .send(data)
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
    it('should return system info', function(done) {
      this.skip();
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
