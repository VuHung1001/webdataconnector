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
        console.log("========== The file was saved!");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("success");
      }); 
    });
  } else {
    serve(req, res, finalhandler(req, res));
  }
});
httpServer.listen(serverPortNumber, '0.0.0.0');

console.log(`[HTTP Server] serving at: http://localhost:${serverPortNumber.toString().trim()}/Simulator/index.html`);
console.log(`[HTTP Server] disable serving resources with cache: ${disableCache}`);
