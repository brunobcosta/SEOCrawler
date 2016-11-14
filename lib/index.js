module.exports = function (url,fileName) {
    var othis = this;

    var _ = require('lodash');
    var crawlerjs = require('crawler-js');
    var jsonfile = require('jsonfile');
    var urlBuilder = require('url');


    var crawler = {
        statusHeader: [200,301,302,404,500],
        preview: 0,
        extractors: [
            {
                selector: 'html',
                callback: function (err, html, url, response) {
                    if (!err) {
                        var r0 = othis.results[_.findIndex(othis.results, function (o) { return o.url == url.get; })];
                        r0.statusCode = response.statusCode;
                        jsonfile.writeFileSync(othis.file, othis.results, { spaces: '\t' });

                        othis.queue--;
                        console.log(othis.queue);
                    }
                }
            },
            {
                selector: 'title',
                callback: function (err, html, url, response) {
                    if (!err) {
                        var r0 = othis.results[_.findIndex(othis.results, function (o) { return o.url == url.get; })];
                        r0.title = html.text();
                        jsonfile.writeFileSync(othis.file, othis.results, { spaces: '\t' });
                    }
                }
            },
            {
                selector: 'meta[name="author"]',
                callback: function (err, html, url, response) {
                    if (!err) {
                        var r0 = othis.results[_.findIndex(othis.results, function (o) { return o.url == url.get; })];
                        r0.author = html.attr('content');
                        jsonfile.writeFileSync(othis.file, othis.results, { spaces: '\t' });

                    }
                }
            },
            {
                selector: 'meta[name="description"]',
                callback: function (err, html, url, response) {
                    if (!err) {
                        var r0 = othis.results[_.findIndex(othis.results, function (o) { return o.url == url.get; })];
                        r0.description = html.attr('content');
                        jsonfile.writeFileSync(othis.file, othis.results, { spaces: '\t' });

                    }
                }
            },
            {
                selector: 'meta[name="keywords"]',
                callback: function (err, html, url, response) {
                    if (!err) {
                        var r0 = othis.results[_.findIndex(othis.results, function (o) { return o.url == url.get; })];
                        r0.description = html.attr('content');
                        jsonfile.writeFileSync(othis.file, othis.results, { spaces: '\t' });

                    }
                }
            },
            {
                selector: '#antiClickjack',
                callback: function (err, html, url, response) {
                    if (!err) {
                        var r0 = othis.results[_.findIndex(othis.results, function (o) { return o.url == url.get; })];
                        r0.antiClickjack = "OK!"
                        jsonfile.writeFileSync(othis.file, othis.results, { spaces: '\t' });

                    }
                }
            },
            {
                selector: 'a',
                callback: function (err, html, url, response) {
                    if (!err) {
                        var finalUrl = '';
                        var path = html.attr('href');
                        if (!path) return;

                        path = urlBuilder.resolve(response.request.href, path);

                        if (path.indexOf('#') == -1 && path.indexOf('javascript:') == -1)
                            if (path.indexOf('http://' + response.request.host) == 0 || path.indexOf('https://' + response.request.host) == 0)
                                finalUrl = path;
                        if (finalUrl.lastIndexOf('/') == finalUrl.length - 1) {
                            finalUrl = finalUrl.substring(0, finalUrl.length - 1);
                        }
                        finalUrl = finalUrl.toLowerCase();



                        othis.addUrlToQueue(finalUrl);
                    } else {
                        console.log(err, url.get);
                    }
                }
            }
        ]
    };

    var config = {
        //localProxy: 'http://10.55.20.71:128'
    }




    othis.addUrlToQueue = function (url) {

        //TODO: remover .pdf estatico daqui 
        if (url != '' && _.indexOf(othis.arr, url) == -1 && !_.endsWith(url, '.pdf')) {
            othis.arr = _.union(othis.arr, [url]);
            othis.results = _.union(othis.results, [{ url: url }]);
            jsonfile.writeFileSync(othis.file, othis.results, { spaces: '\t' });

            var crawlerclone = _.clone(crawler);
            crawlerclone.get = url;
            crawlerjs(crawlerclone);
            othis.queue++;
            console.log('aguarde...', othis.queue);
        }
    }


    var arr = [];
    othis.queue = 0;
    othis.results = [];
    othis.file = './results/'+fileName+'.json';
    addUrlToQueue(url);
}