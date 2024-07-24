//  http module
const http = require('http');

//  port number to navigate to localhost
const port = 3000;

// to create simple HTTP server, use http.createServer((request, response))
const server = http.createServer((req, res) => {
  // Set response HTTP header with HTTP status and Content type
  res.writeHead(200, {'Content-Type': 'text/plain'});

  // Send response body "Hello World"
  res.end('Hello World\n');
});

// Server is now listen to on port 3000
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
