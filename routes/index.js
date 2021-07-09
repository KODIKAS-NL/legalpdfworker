const Converter = require('../services/converter');
const FileHelper = require('../lib/filehelper');

const express = require('express');
const router = express.Router(); // eslint-disable-line
const version = require('../package.json').version;
const getEnv = require('../lib/get-env');
const logger = require('../lib/logger');

router.get('/', (req, res) => {
  res.json({
    name: 'legalthings/pdfworker',
    version,
    description: 'Document to PDF conversion',
    env: getEnv()
  });
});

router.post('/', async function (req, res) {
  const data = req.body.data || {}
  const computed = req.body.computed;
  const body = req.body.body;
  const partials = (req.body.partials || []).reduce((p, c) => {
    p[c.key] = c.text
    return p
  }, {})

  if (typeof body == 'undefined' || body == null) {
    logger.warn('Received empty body: ', JSON.stringify(body), ' for data: ', JSON.stringify(data));
    res.status(400);
    res.setHeader('Content-Type', 'text/plain');
    res.send('Invalid data given');
    return;
  }

  try {
    if (req.get('Accept') && req.get('Accept').indexOf('application/pdf') > -1) {
      const result = await Converter.templateToPDF({ body, data, computed, partials })
      res.writeHead(200, { // eslint-disable-line
        'Content-Type': 'application/pdf',
        'Access-Control-Allow-Origin': '*',
        'Content-Disposition': 'attachment; filename="output.pdf"'
      });
      res.write(result, 'binary');
      res.end(null, 'binary');
    } else {
      const result = await Converter.templateToHTML({ body, data, computed, partials })
      res.status(200);
      res.setHeader('Content-Type', 'text/html');
      res.send(result);
    }
  } catch (e) {
    logger.error(e);
    res.status(500).send(e.shortMessage);
  }
});

router.post('/convert', async function (req, res) {
  // checking if content-type is supported if not sends error message
  var contentType = req.get('Content-Type');
  if (!FileHelper.isSupportedFileType(contentType) && contentType.indexOf('multipart/form-data') === -1) {
      return res.status(415).end('Unable to convert the supplied document');
  }
  var data = null
  if (contentType === 'text/html') {
      data = req.body
  } else if (FileHelper.isImage(contentType)) {
      const image = FileHelper.imageToHtml(req.body, contentType, null);
      data = image.body
      contentType = image.type
  } else {
      const file = await FileHelper.readFile(req.file)
      data = file.body
      contentType = file.type
  }

  try {
      const buffer = await Converter.htmlPageToPDF(data, contentType)
      res.writeHead(200, { // eslint-disable-line
          'Content-Type': 'application/pdf',
          'Access-Control-Allow-Origin': '*',
          'Content-Disposition': 'attachment; filename="output.pdf"'
      });
      res.write(buffer, 'binary');
      res.end(null, 'binary');
  } catch (err) {
      logger.warn('Failed to convert document: ', err);
      res.status(415).end('Unable to convert the supplied document');
  }
});

module.exports = router;