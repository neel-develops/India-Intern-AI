const fs = require('fs');
const path = require('path');

function find(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      find(p);
    } else if (p.endsWith('.tsx')) {
      let content = fs.readFileSync(p, 'utf8');
      if (content.includes('layout=') || content.includes('objectFit=')) {
        content = content.replace(/layout=['"].*?['"]/g, '');
        content = content.replace(/objectFit=['"].*?['"]/g, '');
        fs.writeFileSync(p, content);
        console.log('Fixed img layout in', p);
      }
    }
  });
}

find('src');
