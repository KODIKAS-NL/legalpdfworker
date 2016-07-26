'use strict';
const pdf = require('html-pdf');
const Promise = require('bluebird');
const uuid = require('uuid');
const fileSystem = require('fs');
const hummus = require('hummus');
const options = {
    'border': {
        'top': '2.5cm',
        'right': '2.5cm',
        'bottom': '2.5cm',
        'left': '2.5cm'
    }
};

const convertHTML2PDF = (htmlPage) => {
    return new Promise((resolve, reject) => {
        pdf.create(htmlPage, options).toFile('./tmp/' + uuid.v4() + '.pdf', (error, res) => {
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

exports.convert = (data, documentPath, res) => {
    convertHTML2PDF(data).then((output) => {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Access-Control-Allow-Origin': '*',
                'Content-Disposition': 'attachment; filename="output.pdf"'
            });
            let readStream = fileSystem.createReadStream(output.filename);
            readStream.pipe(res);
            //deleting the file once everything has been sent
            readStream.on('close', function() {
                fileSystem.unlink(output.filename);
                if (documentPath != '')
                    fileSystem.unlink(documentPath);
            });

        },
        (error) => {
            res.status(415).end('Unable to convert the supplied document');
        });
}

exports.editPDF = (data, insert) => {
    return new Promise((resolve, reject) => {
        //searching for the pdf file
        let PDFFile = data.find((file) => {
            return file.fieldname === 'file'
        });
        if (!PDFFile) {
            data.forEach((file) => {
                fileSystem.unlink(file.path);
            });
            return reject({
                error: 'Unable to handle the supplied document(s)'
            });
        }
        //parsing the file to get information about it(page number, width and height of the page)
        let pdfReader = hummus.createReader(PDFFile.path);


        for (let i = 0; i < insert.length; i++) {

            if (insert[i] != null) {
                if (insert[i]['text'] != null && insert[i]['text'] != '') {
                    let pdfWriter = hummus.createWriterToModify(PDFFile.path);
                    //checking if the sent page number isn't out of range, if it is delete all uplaoded files and send error message
                    if (pdfReader.getPagesCount() < insert[i]['page']) {
                        data.forEach((file) => {
                            fileSystem.unlink(file.path);
                        });
                        return reject({
                            error: 'Unable to handle the supplied document(s)'
                        });
                    }

                    //getting the width and height of the page
                    let mediabox = pdfReader.parsePage(insert[i]['page'] - 1).getMediaBox();
                    let pageWidth = mediabox[2];
                    let pageHeight = mediabox[3];

                    //checking if coordinates are negative, if they are we recalculate them
                    if (insert[i]['x'] < 0) {
                        insert[i]['x'] = parseInt(pageWidth) + parseInt(insert[i]['x']);
                    }

                    if (insert[i]['y'] < 0) {
                        insert[i]['y'] = parseInt(insert[i]['y']) * (-1);
                    }
                    //checking if font family is set, if not setting Helvetica as default
                    if (insert[i]['fontFamily'] == '')
                        insert[i]['fontFamily'] = 'Helvetica.otf';

                    let font = pdfWriter.getFontForFile('./fonts/' + insert[i]['fontFamily'])

                    //checking if font size is set, if not setting 12px as default
                    if (insert[i]['fontSize'] == '')
                        insert[i]['fontSize'] = '12';

                    //checking if sent position coordinates are out of bounds, if they are recalculate them
                    let textDimensions = font.calculateTextDimensions(insert[i]['text'], parseInt(insert[i]['fontSize']));
                    if (insert[i]['x'] >= pageWidth)
                        insert[i]['x'] = pageWidth - textDimensions.width - 1;
                    if (insert[i]['y'] >= pageHeight)
                        insert[i]['y'] = pageHeight - textDimensions.height - 1;

                    //writing the text to the page
                    let pageModifier = new hummus.PDFPageModifier(pdfWriter, insert[i]['page'] - 1, true);

                    pageModifier.startContext().getContext().writeText(
                        insert[i]['text'],
                        insert[i]['x'], insert[i]['y'], {
                            font: font,
                            size: insert[i]['fontSize']
                        }
                    );
                    pageModifier.endContext().writePage();
                    pdfWriter.end();

                }
                //geting the image file based on the name of the input file
                let imageFile = data.find((file) => {
                    return file.fieldname === 'insert[' + i + '][image]'
                });

                if (imageFile) {
                    let pdfWriter = hummus.createWriterToModify(PDFFile.path);
                    let mediabox = pdfReader.parsePage(insert[i]['page'] - 1).getMediaBox();
                    let pageWidth = mediabox[2];
                    let pageHeight = mediabox[3];

                    //checking if the sent page number isn't out of range, if it is delete all uplaoded files and send error message
                    if (pdfReader.getPagesCount() < insert[i]['page']) {
                        data.forEach((file) => {
                            fileSystem.unlink(file.path);
                        });
                        return reject({
                            error: 'Unable to handle the supplied document(s)'
                        });
                    }
                    let pageModifier = new hummus.PDFPageModifier(pdfWriter, insert[i]['page'] - 1, true);




                    //checking if coordinates are negative, if they are we recalculate them
                    if (insert[i]['x'] < 0) {
                        insert[i]['x'] = parseInt(pageWidth) + parseInt(insert[i]['x']);
                    }

                    if (insert[i]['y'] < 0) {
                        insert[i]['y'] = parseInt(insert[i]['y']) * (-1);
                    }

                    //checking if coordinates are out of bounds, if they are we recalculate them
                    if (insert[i]['x'] >= pageWidth)
                        insert[i]['x'] = pageWidth - insert[i]['width'] - 1;
                    if (insert[i]['y'] >= pageHeight)
                        insert[i]['y'] = pageHeight - insert[i]['height'] - 1;

                    //inserting the image on the page
                    pageModifier.startContext().getContext().drawImage(parseInt(insert[i]['x']), parseInt(insert[i]['y']), imageFile.path, {
                        transformation: {
                            width: insert[i]['width'],
                            height: insert[i]['height'],
                            proportional: true
                        }
                    });
                    pageModifier.endContext().writePage();
                    pdfWriter.end();
                }
            }
        }
        resolve({
            PDFFile: PDFFile.path,
            files: data
        });
    });
}
