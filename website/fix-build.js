const fs = require('fs');
const path = require('path');

// Function to recursively search for files
function findFiles(dir, fileTypes) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== 'build') {
      // Recursive case: it's a directory
      results = results.concat(findFiles(filePath, fileTypes));
    } else {
      // Base case: it's a file
      if (fileTypes.some(type => file.endsWith(type))) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Find all JS/JSX files
const jsFiles = findFiles('./src', ['.js', '.jsx']);

// Check each file for potential "js is not defined" errors
jsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.match(/\bjs\b/) && !content.match(/\bconst js\b|\blet js\b|\bvar js\b|\bimport.*js\b|\bfunction js\b/)) {
    console.log(`Potential "js is not defined" error in file: ${file}`);
  }
});

console.log('Build fix script complete!');