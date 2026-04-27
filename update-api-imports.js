const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/ai-career-coach.tsx',
  'src/components/mock-interview.tsx',
  'src/components/resume-analyser.tsx',
  'src/components/skill-gap-visualizer.tsx',
  'src/components/smart-match-candidates.tsx',
  'src/components/smart-match-internships.tsx'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace import { something } from '@/ai/flows/something' with import { something } from '@/lib/api'
    content = content.replace(/import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]@\/ai\/flows\/[^'"]+['"];?/g, "import { $1 } from '@/lib/api';");
    
    // If there are multiple, they might get duplicated, but TypeScript/Vite will complain if there's duplicate imports. 
    // It's better to just collapse them if we can, but a simple replace works for now.
    
    fs.writeFileSync(filePath, content);
  }
});
console.log('API imports updated');
