'use strict';
const app = require('../../server');
const request = require('supertest');
const fs = require('fs');
const should = require('should');

const TIMEOUT = 20000;

describe('Tasks', () => {

  describe('POST /convert', () => {
    it('should return pdf document(sending html code in body)', function (done) {
      this.timeout(TIMEOUT);
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
    it('should return pdf document when sending an html file', function (done) {
      this.timeout(TIMEOUT);
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
    it('should return pdf document when sending png image', function (done) {
      this.timeout(TIMEOUT);
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
    it('should return pdf document when sending png image', function (done) {
      this.timeout(TIMEOUT);
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
    it('should return pdf document when sending svg image', function (done) {
      this.timeout(TIMEOUT);
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
    it('should return system info', function (done) {
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
  describe('POST /', () => {
    it('should return contents of processed template', function (done) {
      this.timeout(TIMEOUT);
      request(app)
        .post('/')
        .send({
          "body": `<p>The employee {{ employee.first_name }} {{ employee.last_name }} works at the company {{ company_name }}</p>`,
          "data": {
            "company_name": "My Company",
            "year": 2014,
            "strict_policy": true,
            "employee": {
              "first_name": "John",
              "last_name": "Doe",
              "date_of_birth": "01-01-1970"
            }
          }
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .expect('<p>The employee John Doe works at the company My Company</p>', done);
    });
  });
  describe('POST /', () => {
    it('should return contents as pdf of processed template', function (done) {
      this.timeout(TIMEOUT);
      request(app)
        .post('/')
        .set({
          'Content-Type': 'application/json',
          'Accept' : 'application/pdf' //set accept header to receive pdf
        })
        .send({
          "body": `<p>The employee {{ employee.first_name }} {{ employee.last_name }} works at the company {{ company_name }}</p>`,
          "data": {
            "company_name": "My Company",
            "year": 2014,
            "strict_policy": true,
            "employee": {
              "first_name": "John",
              "last_name": "Doe",
              "date_of_birth": "01-01-1970"
            }
          },
          "font":"Open Sans" //font to be used in pdf
        })
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
  describe('POST /', () => {
    it('should evaluate and process simple conditions in template', function (done) {
      this.timeout(TIMEOUT);
      request(app)
        .post('/')
        .send({
          data: {
            strict: false,
            not_strict: true
          },
          body: "{{#if strict}}<p>Strict</p>{{/if strict}}{{#if not_strict}}<p>Not strict</p>{{/if not_strict}}"
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .expect("<p>Not strict</p>", done);
    });
  });

  describe('POST /', () => {
    it('should not encode basic html tags in the data after ractive fills it into the template', function (done) {
      this.timeout(TIMEOUT);
      request(app)
        .post('/')
        .send({
          data: {
            name: 'John Doe',
            summary_html: '<h1>Summary</h1><p>[2017-12-14 09:24:56] Moesjarraf J: dit is een nieuwe set van berichten</p><p>[2017-12-14 09:24:59] Moesjarraf J: dit is nog een nieuwe set</p>'
          },
          body: "Hi {{ name }}. Below you can find a summary: {{ summary_html }}"
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .expect("Hi John Doe. Below you can find a summary: <h1>Summary</h1><p>[2017-12-14 09:24:56] Moesjarraf J: dit is een nieuwe set van berichten</p><p>[2017-12-14 09:24:59] Moesjarraf J: dit is nog een nieuwe set</p>", done);
    });
  });

  describe('POST /', () => {
    it('should not break html links in template', function (done) {
      this.timeout(TIMEOUT);
      request(app)
        .post('/')
        .send({
          data: {
            name: 'John',
            _config: {
              public_url: 'example.com'
            },
            hash: '1234'
          },
          body: "<p>Hi {{ name }},</p><p><br></p><p>Je hebt reeds een verzoek aangevraagd voor het resetten van jouw wachtwoord.</p><p>Klik hiervoor op deze <a data-cke-saved-href=\"https://{{ _config.public_url }}/set-password?hash={{ hash }}\" href=\"https://{{ _config.public_url }}/set-password?hash={{ hash }}\">link</a>.</p><p>Mocht je nog problemen hebben met het verkrijgen van toegang tot jouw account, verstuur dan gerust een bericht naar info@legalthings.io</p><p><br></p><p>Met vriendelijke groet,</p><p>LegalThings</p>"
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .expect("<p>Hi John,</p><p><br></p><p>Je hebt reeds een verzoek aangevraagd voor het resetten van jouw wachtwoord.</p><p>Klik hiervoor op deze <a data-cke-saved-href=\"https://example.com/set-password?hash=1234\" href=\"https://example.com/set-password?hash=1234\">link</a>.</p><p>Mocht je nog problemen hebben met het verkrijgen van toegang tot jouw account, verstuur dan gerust een bericht naar info@legalthings.io</p><p><br></p><p>Met vriendelijke groet,</p><p>LegalThings</p>", done);
    });
  });

  describe('POST /', () => {
    it('should evaluate and process more complicated (nested in DOM) conditions in template', function (done) {
      this.timeout(TIMEOUT);
      request(app)
        .post('/')
        .send({
          data: {
            "end_date": false,
            "url": "/foo.pdf",
            "id": "foo",
            "_config": {
              "public_url": "http://example.com"
            }
          },
          body: "<p>{{#if end_date}}</p><p>Expires {{end_date}}.</p><p>{{/if end_date}}</p><p>Document id: {{id}}</p>"
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .expect("<p>Document id: foo</p>", done);
    });
  });

  describe('POST /', () => {
    it('should evaluate and process content but not touch html entities outside ractive expressions', function (done) {
      this.timeout(TIMEOUT);
      request(app)
        .post('/')
        .send({
          data: {
            "subject": "subject",
            "name": "name",
            "email": "email",
            "question": "question"
          },
          body: "<p>-------- Forwarded Message --------<br></p><p>Subject: {{ subject }}<br></p><p>From: {{ name }} <{{ email }}></p><p><br></p><p>{{ question }}</p>"
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .expect("<p>-------- Forwarded Message --------<br></p><p>Subject: subject<br></p><p>From: name &lt;email&gt;</p><p><br></p><p>question</p>", done);
    });
  });

  describe('POST /', () => {
    it('should preserve the nbsp inside page breaks', function (done) {
      this.timeout(TIMEOUT);
      request(app)
        .post('/')
        .send({
          data: {},
          body: [
            ' <foo>&nbsp;</foo> ',
            '<div style="page-break-after: always"><span style="display:none">&nbsp;</span></div>',
            '<div style="page-break-before: always"><span style="display:none">&nbsp;</span></div>',
            '<div style="page-break-inside: always"><span style="display:none">&nbsp;</span></div>'
          ].join('')
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .expect([
          '<foo></foo>', // note that <foo> is cleaned but page breaks are not
          '<div style="break-after: page;"><span style="display: none;">&nbsp;</span></div>',
          '<div style="break-before: page;"><span style="display: none;">&nbsp;</span></div>',
          '<div><span style="display: none;"></span></div>' // 'page-break-inside: always' is not a valid page break
        ].join(''), done);
    });
  });

  describe('POST /', () => {
    it('should evaluate and process nested conditions in template', function (done) {
      this.timeout(TIMEOUT);
      request(app)
        .post('/')
        .send({
          data: {
            P1: {
              bevoegdheid_bestuur: 'gezamenlijk bevoegd',
              natuurlijk_persoon: 'natuurlijk_persoon P1',
              type: 'Rechtspersoon'
            },
            P2: {
              bevoegdheid_bestuur: 'gezamenlijk bevoegd',
              natuurlijk_persoon: 'natuurlijk_persoon P2',
              type: 'Rechtspersoon'
            },
            P3: {
              // bevoegdheid_bestuur: 'gezamenlijk bevoegd',
              natuurlijk_persoon: 'natuurlijk_persoon P3',
              type: 'Rechtspersoon'
            },
            P4: {
              bevoegdheid_bestuur: 'gezamenlijk bevoegd',
              natuurlijk_persoon: 'natuurlijk_persoon P4',
            },
            P11: {
              bevoegdheid_bestuur: 'gezamenlijk bevoegd',
              natuurlijk_persoon: 'natuurlijk_persoon P11',
              type: 'Rechtspersoon'
            },
            P12: {
              bevoegdheid_bestuur: 'gezamenlijk bevoegd',
              natuurlijk_persoon: 'natuurlijk_persoon P12',
              type: 'Rechtspersoon'
            },
            P21: {
              bevoegdheid_bestuur: 'gezamenlijk bevoegd',
              natuurlijk_persoon: 'natuurlijk_persoon P21',
              type: 'Rechtspersoon'
            },
            P22: {
              bevoegdheid_bestuur: 'gezamenlijk bevoegd',
              natuurlijk_persoon: 'natuurlijk_persoon P22',
              type: 'Rechtspersoon'
            },
            P31: {
              bevoegdheid_bestuur: 'gezamenlijk bevoegd',
              natuurlijk_persoon: 'natuurlijk_persoon P31',
              type: 'Rechtspersoon'
            },
            P32: {
              bevoegdheid_bestuur: 'gezamenlijk bevoegd',
              natuurlijk_persoon: 'natuurlijk_persoon P32',
              type: 'Rechtspersoon'
            },
            P41: {
              bevoegdheid_bestuur: 'gezamenlijk bevoegd',
              natuurlijk_persoon: 'natuurlijk_persoon P41',
              type: 'Rechtspersoon'
            },
            P42: {
              bevoegdheid_bestuur: 'gezamenlijk bevoegd',
              natuurlijk_persoon: 'natuurlijk_persoon P42',
              type: 'Rechtspersoon'
            },
            data: {
              aantal_vennoten: 5
            }
          },
          body: `
                <ol>
                    <li>{{^ P1.bevoegdheid_bestuur == "gezamenlijk bevoegd" }}{{ P1.natuurlijk_persoon }}{{/ P1.bevoegdheid_bestuur == "gezamenlijk bevoegd" }}{{# P1.bevoegdheid_bestuur == "gezamenlijk bevoegd" }}{{ P11.natuurlijk_persoon }}<br />
                    EN<br />
                    {{ P12.natuurlijk_persoon }}{{/ P1.bevoegdheid_bestuur == "gezamenlijk bevoegd" }}{{# P1.type == "Rechtspersoon" }}<br />
                    {{ P1.rechts_rechtspersoon }}{{/ P1.type == "Rechtspersoon" }}<br />
                    {{# data.aantal_vennoten >= 2 }}</li>

                    <li>{{^ P2.bevoegdheid_bestuur == "gezamenlijk bevoegd" }}{{ P2.natuurlijk_persoon }}{{/ P2.bevoegdheid_bestuur == "gezamenlijk bevoegd" }}{{# P2.bevoegdheid_bestuur == "gezamenlijk bevoegd" }}{{ P21.natuurlijk_persoon }}<br />
                    EN<br />
                    {{ P22.natuurlijk_persoon }}{{/ P2.bevoegdheid_bestuur == "gezamenlijk bevoegd" }}{{# P2.type == "Rechtspersoon" }}<br />
                    {{ P2.rechts_rechtspersoon }}{{/ P2.type == "Rechtspersoon" }}<br />
                    {{/ data.aantal_vennoten >= 2 }}{{# data.aantal_vennoten >= 3 }}</li>

                    <li>{{^ P3.bevoegdheid_bestuur == "gezamenlijk bevoegd" }}{{ P3.natuurlijk_persoon }}{{/ P3.bevoegdheid_bestuur == "gezamenlijk bevoegd" }}{{# P3.bevoegdheid_bestuur == "gezamenlijk bevoegd" }}{{ P31.natuurlijk_persoon }}<br />
                    EN<br />
                    {{ P32.natuurlijk_persoon }}{{/ P3.bevoegdheid_bestuur == "gezamenlijk bevoegd" }}{{# P3.type == "Rechtspersoon" }}<br />
                    {{ P3.rechts_rechtspersoon }}{{/ P3.type == "Rechtspersoon" }}<br />
                    {{/ data.aantal_vennoten >= 3 }}{{# data.aantal_vennoten >= 4 }}</li>

                    <li>{{^ P4.bevoegdheid_bestuur == "gezamenlijk bevoegd" }}{{ P4.natuurlijk_persoon }}{{/ P4.bevoegdheid_bestuur == "gezamenlijk bevoegd" }}{{# P4.bevoegdheid_bestuur == "gezamenlijk bevoegd" }}{{ P41.natuurlijk_persoon }}<br />
                    EN<br />
                    {{ P42.natuurlijk_persoon }}{{/ P4.bevoegdheid_bestuur == "gezamenlijk bevoegd" }}{{# P4.type == "Rechtspersoon" }}<br />
                    {{ P4.rechts_rechtspersoon }}{{/ P4.type == "Rechtspersoon" }}{{/ data.aantal_vennoten >= 4 }}</li>
                </ol>`
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .expect('<ol><li>natuurlijk_persoon P11<br> EN<br> natuurlijk_persoon P12<br> <br></li><li>natuurlijk_persoon P21<br> EN<br> natuurlijk_persoon P22<br> <br></li><li>natuurlijk_persoon P3<br> <br></li><li>natuurlijk_persoon P41<br> EN<br> natuurlijk_persoon P42</li></ol>', done);
    });
  });

  describe('POST /', () => {
    it('should not return a 400 if no data is given', function (done) {
      this.timeout(TIMEOUT);
      request(app)
        .post('/')
        .send({
          body: "<p>-------- Forwarded Message --------<br></p><p>Subject: {{ subject }}<br></p><p>From: {{ name }} <{{ email }}></p><p><br></p><p>{{ question }}</p>",
          data: null
        })
        .expect(200)
        .expect('Content-Type', /text/)
        .expect('<p>-------- Forwarded Message --------<br></p><p>Subject: <br></p><p>From:  &lt;&gt;</p><p><br></p><p></p>', done);
    });
  });

  describe('POST /', () => {
    it('should return a 400 if no template is given', function (done) {
      this.timeout(TIMEOUT);
      request(app)
        .post('/')
        .send({
          body: null,
          data: {
            foo: 'bar'
          }
        })
        .expect(400)
        .expect('Content-Type', /text/)
        .expect('Invalid data given', done);
    });
  });
});