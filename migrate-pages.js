const fs = require('fs');
const path = require('path');

function movePages(sourceDir, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Handle the root page.tsx
  const rootPage = path.join(__dirname, 'src', 'app', 'page.tsx');
  if (fs.existsSync(rootPage)) {
    fs.copyFileSync(rootPage, path.join(targetDir, 'Home.tsx'));
  }

  const appDir = path.join(__dirname, 'src', 'app', '(app)');
  if (!fs.existsSync(appDir)) return;

  const dirs = fs.readdirSync(appDir);
  dirs.forEach(dir => {
    const pagePath = path.join(appDir, dir, 'page.tsx');
    if (fs.existsSync(pagePath)) {
      // Capitalize first letter
      const componentName = dir.charAt(0).toUpperCase() + dir.slice(1).replace(/-./g, x => x[1].toUpperCase());
      fs.copyFileSync(pagePath, path.join(targetDir, `${componentName}.tsx`));
    }
    
    // Some routes might have nested pages like /internships/[id]
    const subDirs = fs.readdirSync(path.join(appDir, dir), { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
      
    subDirs.forEach(subDir => {
       const subPagePath = path.join(appDir, dir, subDir, 'page.tsx');
       if (fs.existsSync(subPagePath)) {
          const componentName = dir.charAt(0).toUpperCase() + dir.slice(1).replace(/-./g, x => x[1].toUpperCase()) + 'Details';
          fs.copyFileSync(subPagePath, path.join(targetDir, `${componentName}.tsx`));
       }
    });
  });
}

movePages(path.join(__dirname, 'src', 'app'), path.join(__dirname, 'src', 'pages'));
console.log('Pages moved to src/pages');
