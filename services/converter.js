const mustacheTidy = require('mustache-tidy');
const Ractive = require('ractive');
const ent = require('ent');
const logger = require('../lib/logger');
const moment = require('moment');
const HTMLToPDF = require('html5-to-pdf');
const path = require('path');
const FileHelper = require('../lib/filehelper');

const ractive_path = path.resolve('node_modules/moment/moment.js')
const moment_path = path.resolve('node_modules/ractive/ractive.js')
const jquery_path = path.resolve('node_modules/jquery/dist/jquery.min.js')

const spellit_path = path.resolve('puppeteer-scripts/spellit.js')
const functions_path = path.resolve('puppeteer-scripts/functions.js')
const extend_native_path = path.resolve('puppeteer-scripts/extend-native.js')

const html5_template_path = path.resolve('templates/html5bp')

const iso_dateregex = /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})[+-](\d{2})\:(\d{2})/

const itterate = function (obj, action) {
    Object.getOwnPropertyNames(obj).forEach(function (p) {
        if (obj[p] !== null) {
            if (typeof (obj[p]) === "object")
                itterate(obj[p], action)
            else
                action(obj, p)
        }
    })
}

class Converter {
    async startHtmlToPdf(body, template_path, scripts = [], isImage = false) {
        const options = {
            pdf: {
                format: 'A4',
                printBackground: true
            },
            launchOptions: {
                args: [
                    '--no-sandbox',
                    '--site-per-process'
                ]
            },
            inputBody: body,
            templatePath: template_path,
            include: scripts.map(path => ({ type: "js", filePath: path }))

        };

        if (!isImage) {
            options.pdf.margin = {
                top: 100,
                right: 100,
                bottom: 100,
                left: 100
            };
        }

        const htmlToPDF = new HTMLToPDF(options);
        await htmlToPDF.start()
        return htmlToPDF
    }

    preProcessesParams({ body, data, computed, partials, font }) {
        if (typeof data == 'string') answers = JSON.parse(data);
        this.parseDates(data);
        const tidyContent = this.decodeMustacheExpressions(mustacheTidy(body));
        const cleanContent = this.cleanTemplate(tidyContent);

        return { body: cleanContent, data, computed, partials, font }
    }

    parseDates(answers) {
        var lang = answers._lang || "nl"
        itterate(answers, function (obj, prop) {
            try {
                if (typeof (obj[prop]) === "string" && obj[prop].match(iso_dateregex)) {
                    var date = moment(obj[prop]);
                    date.locale(lang)
                    if (date.isValid())
                        obj[prop] = date.format('L')
                }
            } catch {

            }
        })
    }

    decodeMustacheExpressions(content) {
        // @todo: this should be built into mustache-tidy
        return content.replace(/{{(.*?)}}/g, function (a, b) {
            return '{{' + ent.decode(b) + '}}';
        });
    }

    cleanTemplate(content) {
        content = content.replace(/(<br\s*\/?>[\s\n]*)({{[\/#][^}]*}}[\s\n]*)<br\s*\/?>/g, '$1$2');
        content = content.replace(/(\{{2,3}[#\/\?]?\s*)(\$\[\d+\.\d+\])(\s*\}{2,3})/g, '$1 ($2) + "" $3');
        content = content.replace(/\#(\d+)(\s|&nbsp;|<)/g, '<span class="article" data-reference="$1">{{ $[$1] }}</span>$2');
        content = content.replace(/\#(\d+)\.(\d+)(\s|&nbsp;|<)/g, '<span class="article" data-reference="$1.$2">{{ $["$1.$2"] }}</span>$3');
        return content
    }

    async applyRactive(htmlToPdf, template, answers, computed, partials) {
        if (typeof computed == 'string') computed = JSON.parse(computed);
        if (typeof answers == 'string') answers = JSON.parse(answers);

        const page = htmlToPdf.page
        this.logMessages(page)
        await page.evaluate(({ template, answers, computed, partials }) => {
            window.lang = answers._lang || $('html').attr('lang');
            window.currency = answers.currency
            try {
                var ractive = new Ractive({
                    el: 'body',
                    template: template,
                    data: answers,
                    computed: computed,
                    partials: partials
                });
                refreshAutonumber(ractive);
                let doc = $('body');
                removeEmptyListItems(doc);
                preservePagebreaks(doc);
            } catch (e) {
                console.error(`${e.message} : ${e}`)
            }
        }, {
            template, answers, computed, partials
        })
    }

    decodeBasicHtml(content) {
        // after ractive parses the content with answers, the html in the answers is encoded
        // this function decodes basic html, such as paragraphs so it can be used in the html
        var result = content;
        var allowed = [
            'p', 'b', 'i',
            'li', 'ul', 'ol',
            'br', 'hr',
            'h1', 'h2', 'h3', 'h4', 'h5'
        ];

        allowed.forEach(function (e) {
            var start = '<' + e + '>';
            var end = '</' + e + '>';
            result = result
                .replace(new RegExp(ent.encode(start, { named: true }), 'g'), start)
                .replace(new RegExp(ent.encode(end, { named: true }), 'g'), end);
        });

        return result;
    }

    logMessages(page) {
        page.on('console', message => {
            let type = message.type()
            type = type == "warning" ? "warn" : type
            if (['endGroup', 'startGroupCollapsed'].indexOf(type) > -1)
                return;

            if (logger[type] !== undefined)
                logger[type](message.text())
            else
                logger.info(`${type} ${message.text()}`)
        })
            .on('pageerror',
                ({ message }) => logger.error(message))
            .on('requestfailed', request =>
                logger.error(`${request.failure().errorText} ${request.url()}`))
    }
}

const converter = new Converter();
module.exports = new (class {
    async templateToHTML({ body, data, computed, partials }) {
        var { body, data, computed, partials } = converter.preProcessesParams({ body, data, computed, partials })
        var htmlToPdf = null
        try {
            htmlToPdf = await converter.startHtmlToPdf(
                "<!doctype html><html><body></body></html>",
                html5_template_path,
                [ractive_path, jquery_path, moment_path, spellit_path, functions_path, extend_native_path]
            )
            await converter.applyRactive(htmlToPdf, body, data, computed, partials)
            await htmlToPdf.page.waitForTimeout(1000)
            const element = await htmlToPdf.page.waitForSelector('body');
            const result = await element.evaluate(el => el.innerHTML);
            return converter.decodeBasicHtml(result);
        } finally {
            if (htmlToPdf) htmlToPdf.close()
        }
    }
    async templateToPDF({ body, data, computed, partials, font }) {
        var { body, data, computed, partials, font } = converter.preProcessesParams({ body, data, computed, partials, font })
        const fontlink = font ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=${encodeURIComponent(font)}:400,700">` : ""
        var htmlToPdf = null
        try {
            htmlToPdf = await converter.startHtmlToPdf(
                `<!doctype html>
                <html>
                    <head>
                        ${fontlink}
                        <link rel="stylesheet" href="https://s3-eu-west-1.amazonaws.com/legalthings-cdn/bootstrap-html-pdf/css/bootstrap.min.css">
                    </head>
                    <body></body>
                </html>`,
                html5_template_path,
                [ractive_path, jquery_path, moment_path, spellit_path, functions_path, extend_native_path]
            )
            await converter.applyRactive(htmlToPdf, body, data, computed, partials)
            await htmlToPdf.page.waitForTimeout(1000)
            const result = await htmlToPdf.build()
            return result
        } finally {
            if (htmlToPdf) htmlToPdf.close()
        }
    }

    async htmlPageToPDF(html, type) {
        const body = html.replace(/[\u2028\u2029]/g, '');
        const isImage = FileHelper.isImage(type)
        var htmlToPdf = null
        try {
            const htmlToPdf = await converter.startHtmlToPdf(
                body,
                html5_template_path,
                [],
                isImage
            )
            await htmlToPdf.page.waitForTimeout(1000)
            const result = await htmlToPdf.build()
            return result
        } finally {
            if (htmlToPdf) htmlToPdf.close()
        }
    }
})()