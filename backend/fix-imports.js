const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'flows');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove 'use server';
    content = content.replace(/'use server';\n?/g, '');
    
    // Replace @/ai/genkit with ../genkit
    content = content.replace(/@\/ai\/genkit/g, '../genkit');
    
    // Remove imports of Internship and Skill from @/lib/types if they exist,
    // they are only used as types in the frontend, in backend we can just use any or inline them for now
    content = content.replace(/import type \{.*?\} from '@\/lib\/types';\n?/g, '');
    
    fs.writeFileSync(filePath, content);
  }
});

console.log('Fixes applied.');
