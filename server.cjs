const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC = path.join(__dirname, 'dist');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  let filePath = path.join(PUBLIC, url === '/' ? 'index.html' : url);
  const ext = path.extname(filePath);
  const isHtml = ext === '.html' || url === '/';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(PUBLIC, 'index.html'), (err2, data2) => {
        if (err2) {
          res.writeHead(500);
          return res.end('500 Internal Server Error');
        }
        res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-cache' });
        return res.end(data2);
      });
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': isHtml ? 'no-cache' : 'max-age=3600'
    });
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log(`PAPS server running on http://0.0.0.0:${PORT}`);
});
