const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // Remove "use client" and "use server"
  content = content.replace(/['"]use client['"];?\n?/g, '');
  content = content.replace(/['"]use server['"];?\n?/g, '');

  // Handle next/link
  content = content.replace(/import Link from ['"]next\/link['"];?/g, "import { Link } from 'react-router-dom';");

  // Handle next/image
  content = content.replace(/import Image from ['"]next\/image['"];?/g, "");
  // Simple replacement of <Image ... /> to <img ... />
  // Note: Next.js Image often has width/height which map fine, but might need className
  content = content.replace(/<Image([^>]+)>/g, (match, attrs) => {
      // Remove priority, fill, etc if present (naive approach)
      let newAttrs = attrs.replace(/priority=\{.*?\}/g, '')
                          .replace(/priority\s/g, ' ')
                          .replace(/fill\s/g, ' ')
                          .replace(/unoptimized\s/g, ' ');
      return `<img${newAttrs} />`;
  });

  // Handle next/navigation
  let needsRouterDom = false;
  if (content.includes('next/navigation')) {
    content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]next\/navigation['"];?/g, (match, imports) => {
      let reactRouterImports = [];
      if (imports.includes('useRouter')) reactRouterImports.push('useNavigate');
      if (imports.includes('usePathname')) reactRouterImports.push('useLocation');
      if (imports.includes('useParams')) reactRouterImports.push('useParams');
      if (reactRouterImports.length > 0) {
          needsRouterDom = true;
          return `import { ${reactRouterImports.join(', ')} } from 'react-router-dom';`;
      }
      return '';
    });
  }

  // Replace useRouter with useNavigate
  content = content.replace(/useRouter\(\)/g, "useNavigate()");
  content = content.replace(/router\.push\(/g, "navigate(");
  content = content.replace(/const router = useNavigate/g, "const navigate = useNavigate");

  // Replace usePathname with useLocation().pathname
  content = content.replace(/usePathname\(\)/g, "useLocation().pathname");
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      traverse(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      processFile(filePath);
    }
  });
}

traverse(path.join(__dirname, 'src'));
console.log('Transformations complete.');
