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
      return res.status(404).send('<meta http-equiv="refresh" content="0">');
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

const BASE_URL = 'https://www.myinstants.com';

// Get all sounds (optionally filtered by search)
// Get all sounds (optionally filtered by search)
app.get('/sounds', async (req, res) => {
  try {
    const search = req.query.search;
    const page = req.query.page || 1; // optional query param for pagination
    let url = `${BASE_URL}/api/v1/instants/?format=json&page=${page}`;
    if (search && search.length >= 2) {
      url += `&name=${encodeURIComponent(search)}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const data = await response.json();

    // Map the results
    const sounds = (data.results || []).map(s => ({
      name: s.name,
      mp3: s.sound,   // the API already provides full URL
      slug: s.slug,
      color: s.color,
      image: s.image,
      description: s.description
    }));

    // Include pagination info
    res.json({
      count: data.count,
      next: data.next,
      previous: data.previous,
      results: sounds
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sounds' });
  }
});


app.get('/media/sounds/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const url = `https://www.myinstants.com/media/sounds/${filename}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${filename}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch MP3' });
  }
});
app.get('/media/images/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const url = `https://www.myinstants.com/media/instants_images/${filename}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${filename}`);

    // Convert to buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Set headers and send
    res.setHeader('Content-Type', 'image/png'); // change dynamically if needed
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Keep-alive ping
setInterval(() => {
  https.get('https://games-mht0.onrender.com/ping');
}, 20 * 1000);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
