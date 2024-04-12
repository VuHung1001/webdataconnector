/* eslint-disable no-console */
const http = require('http');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');
const fs = require('fs');

// utilize the same pattern for exiting port and cache settings
const serverPortNumber = process.env.SERVER_PORT || 8888;
const args = process.argv.slice(2);
const disableCache = Array.isArray(args) && args.includes('--no-cache');

// disable cache
const setCustomCacheControl = (res, path) => {
  console.log(`[HTTP Server] serving resource: ${path}`);

  if (disableCache) {
    res.setHeader('Cache-Control', 'public, max-age=0');
  }
};

// serve root folder supporting relative path for accessing resources and cache settings
const serve = serveStatic('./', {
  setHeaders: setCustomCacheControl,
});

const samples = [
  '../Examples/html/get-phutai-mien-IAH.html',
  '../Examples/html/get-phutai-mien-SCADA-30P.html',
  // '../Examples/html/get-phutai-mien-SCADA-5P.html',
  '../Examples/html/get-thuydiennho-mien-IAH.html',
  '../Examples/html/get-rooftop-mien-IAH.html',
  '../Examples/html/get-muatq-IAH.html',
  '../Examples/html/get-sgncdt-thoigiannhanca.html',
  '../Examples/html/get-sosanh-laplich-dah-iah.html',
  '../Examples/html/get-danhsach-nhamay-smhp.html',
  '../Examples/html/get-danhsach-nhamay-bot.html',
  '../Examples/html/get-danhsach-nhamay-ngoaitt.html',
  '../Examples/html/get-congsuathuydong-tomay-IAH.html',
  '../Examples/html/get-congsuathuydong-tomay-SCADA-48CK.html',
  // '../Examples/html/earthquakeUSGS.html',
  // '../Examples/html/earthquakeMultitable.html',
  // '../Examples/html/earthquakeMultilingual.html',
  // '../Examples/html/IncrementalRefreshConnector.html',
  // '../Examples/html/JoinFilteringExample.html',
];

function resetAtMidnight() {
  var now = new Date();
  var night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // the next day, ...
      0, 0, 0 // ...at 00:00:00 hours
  );
  var msToMidnight = night.getTime() - now.getTime();

  setTimeout(function() {
      replaceFilesContent();              //      <-- This is the function being called at midnight.
      resetAtMidnight();    //      Then, reset again next midnight.
  }, msToMidnight);
}

function replaceFilesContent() {
  const today = getFormattedDate(new Date());
  const regex = /&den_ngay=\d{2}\/\d{2}\/\d{4}/;
  console.log('========== Day: ', today);
  for (const sample of samples) {
    const fileUrl = sample.replace('../', './');

    fs.readFile(fileUrl, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      let fileContent = data.replace(
        regex,
        `&den_ngay=${today}`
      );

      fs.writeFile(fileUrl, fileContent, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("========== The file " + fileUrl + " was updated!");
      });
    });
  }
}

function getFormattedDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  
  return month + '/' + day + '/' + year;
}

const httpServer = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/replace-demo-file') {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
      body = JSON.parse(body);
      fs.writeFile(body.fileUrl.replace('../', './'), body.fileContent, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("========== The file " + body.fileUrl + " was saved!");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("success");
      }); 
    });
  } else {
    serve(req, res, finalhandler(req, res));
  }
});
resetAtMidnight();
httpServer.listen(serverPortNumber, '0.0.0.0');

console.log(`[HTTP Server] serving at: http://localhost:${serverPortNumber.toString().trim()}/Simulator/index.html`);
console.log(`[HTTP Server] disable serving resources with cache: ${disableCache}`);
