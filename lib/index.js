var _ = require('lodash');
var crawlerjs = require('crawler-js');
var jsonfile = require('jsonfile');
var urlBuilder = require('url');


function SeoCrawler(fileName) {
    var othis = this;

    var crawler = {
        //localProxy: 'http://10.55.20.71:128',
        statusHeader: [200, 301, 302, 404, 500],
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
                        r0.keywords = html.attr('content');
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
                    if (err) {
                        return console.log(err, url.get);
                    }
                    var finalUrl = othis.sanatizeUrl(html.attr('href'),response);

                    othis.addUrlToQueue(finalUrl);

                }
            },
            {
                selector: 'iframe',
                callback: function (err, html, url, response) {
                    if (err) {
                        return console.log(err, url.get);
                    }
                    var finalUrl = othis.sanatizeUrl(html.attr('src'),response);

                    othis.addUrlToQueue(finalUrl);

                }
            }
        ]
    };

    othis.sanatizeUrl = function (path,response) {
        if (!path) return;
        var finalUrl = '';

        path = urlBuilder.resolve(response.request.href, path);

        if(path.indexOf('javascript:') > -1 && path.indexOf('location') > -1){
            var init = path.indexOf('\'')+1;
            var end = path.indexOf('\'',init);
            path = decodeURIComponent(path.substring(init,end));
            path = urlBuilder.resolve(response.request.href, path);
        }

        if (path.indexOf('#') == -1 && path.indexOf('javascript:') == -1)
            if (path.indexOf('http://' + response.request.host) == 0 || path.indexOf('https://' + response.request.host) == 0)
                finalUrl = path;
        if (finalUrl.lastIndexOf('/') == finalUrl.length - 1) {
            finalUrl = finalUrl.substring(0, finalUrl.length - 1);
        }
        return finalUrl;//.toLowerCase();
    }

    othis.addUrlToQueue = function (url) {

        //TODO: remover .pdf estatico daqui 
        if (url && url != '' && _.findIndex(othis.arr, function(o) { return o.toLowerCase() == url.toLowerCase(); }) == -1 && !_.endsWith(url.toLowerCase(), '.pdf')) {
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
    othis.file = './results/' + fileName + '.json';

    return { addUrlToQueue: othis.addUrlToQueue };
}

exports.SeoCrawler = SeoCrawler; 