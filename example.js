// 'use strict';

// const http = require('http'),
//       PORT = 8124;

// http.createServer((req, res) => {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World!\n');
// }).listen(PORT);

// console.log(`Server running at http://localhost:${PORT}/`);

'use strict';

const http = require('http'),
      fs = require('fs'),
      server = http.createServer(),
      PORT = 8124;

const doRequest = (req, res) => {
  fs.readFile('../../index.html', 'UTF-8',
    function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    }
  );
};

server.on('request', doRequest);
server.listen(PORT);

console.log(`Server running at http://localhost:${PORT}/`);