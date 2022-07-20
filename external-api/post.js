const http = require('http');

const data = JSON.stringify({
  userName: 'ankur',
});

const options = {
  hostname: 'localhost',
  port: 4242,
  path: '/users',
  method: 'POST', // 'PUT' 'DELETE'
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    Authorization: Buffer.from('myUserName' + ':' + 'myPassword').toString(),
  },
};

const request = http.request(options, (response) => {
  console.log(`StatusCode: ${response.statusCode}`);
  console.log(response.headers);

  response.on('data', (chunk) => {
    console.log('This is a chunk: \n');
    console.log(chunk.toString());
  });
});

request.on('error', (err) => {
  console.error(err);
});

request.write(data);

request.end();
