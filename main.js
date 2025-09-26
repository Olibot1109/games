const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

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

app.use((req, res, next) => {
  if (req.url === '/ping') return next(); // skip logging for /ping

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${colorStatus(res.statusCode)} ${duration}ms`);
  });

  next();
});

app.use(express.static(path.join(__dirname, ''), {
  setHeaders: (res, filePath) => {
    if (!res.req.url.startsWith('/ping')) { // optional: skip static logging for /ping
      console.log(`📥 ${filePath}`);
    }
  }
}));


app.get('/ping', (req, res) => {
  res.send('Pong!');
});



setInterval(() => {
  require('http').get(`https://games-mht0.onrender.com/ping`);
}, 20 * 1000); // every 20 seconds


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
