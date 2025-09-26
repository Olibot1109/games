const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = 3000;

// Logging colors
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
};

function colorStatus(status) {
  if (status >= 500) return colors.red + status + colors.reset;
  if (status >= 400) return colors.yellow + status + colors.reset;
  if (status >= 300) return colors.cyan + status + colors.reset;
  return colors.green + status + colors.reset;
}

// Logging middleware
app.use((req, res, next) => {
  if (req.url === '/ping') return next();

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${colorStatus(res.statusCode)} ${duration}ms`);
  });

  next();
});

// Handle requests coming from /projects/editor
app.use((req, res, next) => {
  const referer = req.get('Referer') || '';

  // Serve editor page
  if (req.url === '/projects/editor') {
    const editorHtmlPath = path.join(__dirname, 'projects', 'editor');
    if (fs.existsSync(editorHtmlPath)) {
      return res.type('html').sendFile(editorHtmlPath);
    } else {
      return res.status(404).send('Editor HTML not found');
    }
  }

  // Any request coming from the editor page
  if (referer.includes('/projects/editor')) {
    const filePath = path.join(__dirname, 'scratch', req.url.replace(/^\//, ''));
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return res.sendFile(filePath);
    } else {
      return res.status(404).send('File not found in scratch');
    }
  }

  next(); // all other requests handled normally
});


// Serve other static files normally
app.use(express.static(path.join(__dirname, ''), {
  setHeaders: (res, filePath) => {
    if (!res.req.url.startsWith('/ping')) {
      console.log(`📥 ${filePath}`);
    }
  }
}));

app.get('/ping', (req, res) => {
  res.send('Pong!');
});

// Keep-alive ping
setInterval(() => {
  https.get('https://games-mht0.onrender.com/ping');
}, 20 * 1000);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
