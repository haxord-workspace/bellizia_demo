const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace table wrapper
  content = content.replace(/className="table-wrap"/g, 'className="w-full overflow-x-auto"');
  
  // Replace table tags that don't have classes
  content = content.replace(/<table>/g, '<table className="w-full text-left whitespace-nowrap">');

  // In case there are tables with some existing class or styles, ensure they have whitespace-nowrap
  content = content.replace(/<table className="([^"]*)"/g, (match, classes) => {
    if (!classes.includes('whitespace-nowrap')) {
      return `<table className="${classes} whitespace-nowrap w-full text-left"`;
    }
    return match;
  });

  fs.writeFileSync(filePath, content);
}
console.log('Tables updated to be responsive across all pages.');
