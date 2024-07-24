const http = require('http');
const url = require('url');
const { parse } = require('querystring');

// Example data (in-memory storage for simplicity)
let items = [];

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const pathname = reqUrl.pathname;
  const query = reqUrl.query;

  switch (req.method) {
    case 'GET':
      // Handle GET request to fetch all items
      if (pathname === '/items') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(items));
      } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
      }
      break;
    case 'POST':
      // Handle POST request to add a new item
      if (pathname === '/items') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
          const newItem = parse(body);
          items.push(newItem);
          res.writeHead(201, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(newItem));
        });
      } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
      }
      break;
    case 'PUT':
      // Handle PUT request to update an existing item
      if (pathname.startsWith('/items/')) {
        const itemId = pathname.slice(7); // Extract item ID from URL
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          const updatedItem = parse(body);
          items = items.map(item => {
            if (item.id === itemId) {
              return { ...item, ...updatedItem };
            } else {
              return item;
            }
          });
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(items));
        });
      } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
      }
      break;
    case 'DELETE':
      // Handle DELETE request to remove an item
      if (pathname.startsWith('/items/')) {
        const itemId = pathname.slice(7); // Extract item ID from URL
        items = items.filter(item => item.id !== itemId);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(items));
      } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
      }
      break;
    default:
      res.writeHead(405, {'Content-Type': 'text/plain'});
      res.end('Method Not Allowed');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
