var _ = require('lodash');
var crawlerjs = require('crawler-js');
var jsonfile = require('jsonfile');
const urlBuilder = require('url');


var crawler = {
  //interval: 170,
  //getSample: 'https://meufilhomeuorgulho.ef5.com.br/Home/',
  //get: 'https://meufilhomeuorgulho.ef5.com.br/Home/',
  //get: 'http://www.vamosbrincarjuntos.com.br',
  get: 'https://promonestle2.ef5.com.br/promonescau',
  statusHeader: [200],
  preview: 0,
  extractors: [
    {
      selector: 'title',
      callback: function(err, html, url, response){
        if(!err){        
          var r0 = results[_.findIndex(results,function(o){return o.url==url.get;})];
          r0.title = html.text();
          jsonfile.writeFileSync(file, results, {spaces: '\t'});

          queue--;
          console.log(queue);
        }
      }
    },
    {
      selector: 'meta[name="author"]',
      callback: function(err, html, url, response){
        if(!err){
          var r0 = results[_.findIndex(results,function(o){return o.url==url.get;})];
          r0.author = html.attr('content');
          jsonfile.writeFileSync(file, results, {spaces: '\t'});

        }
      }
    },
    {
      selector: 'meta[name="description"]',
      callback: function(err, html, url, response){
        if(!err){
          var r0 = results[_.findIndex(results,function(o){return o.url==url.get;})];
          r0.description = html.attr('content');
          jsonfile.writeFileSync(file, results, {spaces: '\t'});

        }
      }
    },
    {
      selector: 'meta[name="keywords"]',
      callback: function(err, html, url, response){
        if(!err){
          var r0 = results[_.findIndex(results,function(o){return o.url==url.get;})];
          r0.description = html.attr('content');
          jsonfile.writeFileSync(file, results, {spaces: '\t'});

        }
      }
    },
    {
      selector: '#antiClickjack',
      callback: function(err, html, url, response){
        if(!err){
          var r0 = results[_.findIndex(results,function(o){return o.url==url.get;})];
          r0.antiClickjack = "OK!"
          jsonfile.writeFileSync(file, results, {spaces: '\t'});

        }
      }
    },
    {
      selector: 'a',
      callback: function(err, html, url, response){
        
        if(!err){
          var finalUrl = '';
          var path = html.attr('href');
          if(!path)return;

          path = urlBuilder.resolve(response.request.href, path);         

          if(path.indexOf('#')==-1 && path.indexOf('javascript:')==-1)
            if(path.indexOf('http://'+response.request.host)==0 || path.indexOf('https://'+response.request.host)==0)
              finalUrl = path;
          if(finalUrl.lastIndexOf('/')==finalUrl.length-1)
          {
            finalUrl = finalUrl.substring(0,finalUrl.length-1);
          }
          finalUrl = finalUrl.toLowerCase();

          if(finalUrl!='' && _.indexOf(arr,finalUrl)==-1){

            arr = _.union(arr, [finalUrl]);
            results = _.union(results,[{url:finalUrl}]);
            jsonfile.writeFileSync(file, results, {spaces: '\t'});

            var crawlerclone = _.clone(crawler);
            crawlerclone.get=finalUrl;
            crawlerjs(crawlerclone);
            queue++;
            console.log('aguarde...',queue);
          }
        }else{
          console.log(err, url.get);
        }
      }
    }
  ]
};

var config = {
  //localProxy: 'http://10.55.20.71:128'
}


var arr=[];
var results = [];
var file = 'data.json';
 
var queue=1;

arr = _.union(arr, [crawler.get]);
results = _.union(results,[{url:crawler.get}]);
crawlerjs(_.clone(crawler));
console.log('aguarde...',queue);
