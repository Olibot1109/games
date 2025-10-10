const fs = require('fs');
const path = require('path');

// Folder to scan
const TARGET_FOLDER = path.join(__dirname, '../'); // change this to your folder

// Strings to find and replace
const OLD_STRING = '.unityweb';  // string to replace
const NEW_STRING = '.uwu';  // string to replace it with

/**
 * Recursively process all files in a folder
 * @param {string} folder 
 */
function processFolder(folder) {
  const entries = fs.readdirSync(folder, { withFileTypes: true });

  entries.forEach(entry => {
    const oldPath = path.join(folder, entry.name);
    let newPath = oldPath;

    // Skip the replace.js file
  if (entry.isFile() && entry.name === 'replaceunity.cjs') {
    console.log(`Skipped: ${oldPath}`);
    return; // skip this file
  }

  if (entry.isDirectory() && entry.name.startsWith('.')) {
      console.log(`Skipped hidden folder: ${oldPath}`);
      return;
    }

    if (entry.isDirectory()) {
      processFolder(oldPath); // recurse into subfolders

      // Rename folder if it contains OLD_STRING
      if (entry.name.includes(OLD_STRING)) {
        const newFolderName = entry.name.replace(new RegExp(OLD_STRING, 'g'), NEW_STRING);
        newPath = path.join(folder, newFolderName);
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed folder: ${oldPath} -> ${newPath}`);
      }
    } else if (entry.isFile()) {
      // Replace contents
      replaceInFile(oldPath);

      // Rename file if it contains OLD_STRING
      if (entry.name.includes(OLD_STRING)) {
        const newFileName = entry.name.replace(new RegExp(OLD_STRING, 'g'), NEW_STRING);
        newPath = path.join(folder, newFileName);
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed file: ${oldPath} -> ${newPath}`);
      }
    }
  });
}

/**
 * Replace all occurrences of OLD_STRING with NEW_STRING in a file
 * Handles both text and binary files
 * @param {string} filePath 
 */
function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath); // read as buffer
    const contentStr = content.toString('utf8'); // attempt as text

    const MAX_LENGTH = 10000; // max characters to process

if (contentStr.length > MAX_LENGTH) {
  console.log(`Skipped (too large): ${filePath}`);
} else if (contentStr.includes(OLD_STRING)) {
  const updatedContent = contentStr.replace(new RegExp(OLD_STRING, 'g'), NEW_STRING);
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Updated contents: ${filePath}`);
}
  } catch (err) {
    console.error(`Failed to process ${filePath}:`, err.message);
  }
}

// Start processing
processFolder(TARGET_FOLDER);
console.log('All files and file names processed!');
