'use strict';
const FileReader = require('../../../lib/filehelper');
const should = require('should');

describe('FileHelper', () =>{

  describe('readFile', () => {

    it('should read an html file without processing', () => {

      const file = {
        path: './tests/files/example.html',
        mimetype: 'text/html'
      };

      return FileReader.readFile(file).then((data) => {
        data.should.have.property('body').which.startWith('<!DOCTYPE html');
        data.should.have.property('documentPath').which.is.equal('./tests/files/example.html');
      });
    });

    it('should read a png and convert it to bases64 ', () => {

      const file = {
        path: './tests/files/example-image.png',
        mimetype: 'image/png'
      };

      return FileReader.readFile(file).then((data) => {

        const html =
          `<html>
            <style>
              html, body, div, img {
                border: 0;
                margin: 0;
                padding: 0;
              }
              img {
                max-width: 8in;
              }
            </style>
            <body>
              <img src='data:image/png;base64,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'></img>
            </body>
          </html>`;

        data.should.have.property('body').which.equal(html);
        data.should.have.property('documentPath').which.is.equal('./tests/files/example-image.png');
      });
    });

    it('should read a svg and surround in with html ', () => {

      const file = {
        path: './tests/files/example-image.svg',
        mimetype: 'image/svg+xml'
      };

      return FileReader.readFile(file).then((data) => {

        const html =
          `<html>
            <style>
              html, body, div, img {
                border: 0;
                margin: 0;
                padding: 0;
              }
              img {
                max-width: 8in;
              }
            </style>
            <body>
              <img src='data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="310px" height="67px" viewBox="0 0 310 67" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 41 (35326) - http://www.bohemiancoding.com/sketch -->
    <title>logo_legal_things </title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="logo_legal_things-" transform="translate(1.000000, 1.000000)">
            <g id="XMLID_27_-Copy" transform="translate(41.000000, 18.000000)" fill="#0088FF">
                <polygon id="XMLID_24_" points="0.2 5.5 4.7 0.5 15.1 0.5 10.5 5.5"></polygon>
            </g>
            <path d="M22.3296734,48.5 C18.6296734,48.5 15.6296734,47.4 13.6296734,45.3 C10.9296734,42.4 10.9296734,38.7 11.0296734,38.3 L11.2296734,19.8 L15.9296734,25.2 L15.9296734,38.4 C15.9296734,38.6 15.9296734,40.6 17.2296734,41.9 C18.3296734,43 20.0296734,43.6 22.3296734,43.6 L33.5296734,43.6 L33.5296734,29.6 C33.5296734,29.1 33.6296734,26.7 32.2296734,25.3 C31.4296734,24.4 30.2296734,24 28.5296734,24 L24.0296734,24 L19.7296734,19 L28.5296734,19 C31.6296734,19 34.0296734,20 35.8296734,21.9 C38.7296734,25 38.4296734,29.3 38.3296734,29.8 L38.3296734,48.5 L22.3296734,48.5 L22.3296734,48.5 Z" id="XMLID_22_-Copy" fill="#0088FF"></path>
            <g id="XMLID_15_-Copy" stroke="#0088FF" stroke-width="2">
                <path d="M64.8,32.3 C64.8,50 50.4,64.3 32.7,64.3 C15,64.3 0.6,50 0.6,32.3 C0.6,14.6 15,0.3 32.7,0.3 C50.4,0.3 64.8,14.6 64.8,32.3" id="XMLID_21_"></path>
            </g>
            <text id="LegalThings-Copy-2" font-family="Raleway-Bold, Raleway" font-size="40" font-weight="bold" fill="#032240">
                <tspan x="74" y="48">LegalThings</tspan>
            </text>
        </g>
    </g>
</svg>'></img>
            </body>
          </html>`;

        data.should.have.property('body').which.equal(html);
        data.should.have.property('documentPath').which.is.equal('./tests/files/example-image.svg');
      });
    });
  });
});
