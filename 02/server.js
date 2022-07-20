const http = require('http');
const url = require('url');
const jsonBody = require('body/json');
const formidable = require('formidable');
const services = require('../services');

const server = http.createServer();
server.on('request', (request, response) => {
  //console.log(request.method, request.url);
  const parseUrl = url.parse(request.url, true);

  if (request.method === 'GET' && parseUrl.pathname === '/metadata') {
    const { id } = parseUrl.query;
    const metadata = services.fetchImageMetaData(id);
    response.setHeader('Content-type', 'application/json');
    response.statusCode = 200;
    const serializedJSON = JSON.stringify(metadata);
    response.write(serializedJSON);
    response.end();
  } else if (request.method === 'POST' && parseUrl.pathname === '/users') {
    jsonBody(request, response, function (err, body) {
      if (err) {
        console.log(err);
      } else {
        console.log(body);
        services.createUser(body['username']);
      }
    });
  } else if (request.method === 'POST' && parseUrl.pathname === '/upload') {
    const form = new formidable.IncomingForm({
      uploadDir: __dirname,
      keepExtensions: true,
      multiples: true,
      maxFileSize: 5 * 1024 * 1024,
      encoding: 'utf-8',
      maxFields: 20,
    });

    // file upload callback ways
    /* form.parse(request, (err, fields, files) => {
      if (err) {
        console.log(err);
        response.statusCode = 500;
        response.end('Error!');
      }
      console.log('\n fields:');
      console.log(fields);
      console.log('\n files');
      console.log(files);
      response.statusCode = 200;
      response.end('Success');
    }); */

    // file upload with events asynchronous ways
    form
      .parse(request)
      .on('fileBegin', (name, file) => {
        console.log('Our upload has started!');
      })
      .on('file', (name, file) => {
        console.log('Field + file pair has been received');
      })
      .on('field', (name, value) => {
        console.log('Field received:');
        console.log(name, value);
      })
      .on('progress', (bytesReceived, bytesExpected) => {
        console.log(bytesReceived + ' / ' + bytesExpected);
      })
      .on('error', (err) => {
        console.error(err);
        request.resume();
      })
      .on('aborted', (err) => {
        console.error('Request aborted by user!');
      })
      .on('end', () => {
        console.log('Done - request fully received!');
        response.end('Success!');
      });
  } else {
    /* response.statusCode = 404;
    response.setHeader('X-Powered-By', 'Node');
    response.setHeader('Hello', 'World'); */
    response.writeHead(404, {
      'X-Powered-By': 'Node',
    });
    response.end();
  }
});

server.listen(4242);
