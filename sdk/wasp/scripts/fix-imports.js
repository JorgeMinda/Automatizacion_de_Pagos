import * as fs from "node:fs";
import * as path from "node:path";

const base = path.resolve(import.meta.dirname, "..", "dist");

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (full.endsWith('.js') && !full.endsWith('.map')) {
      let content = fs.readFileSync(full, 'utf8');
      const updated = content.replace(/(from\s+['"]|import\s+['"]|export\s+[^'"]*?from\s+['"]|import\(['"])(\.[^'"]+?)(['"])/g, (match, p1, p2, p3) => {
        if (p2.endsWith('.js') || p2.endsWith('.json') || p2.endsWith('.node')) return match;
        const resolvedPath = path.resolve(path.dirname(full), p2);
        if (fs.existsSync(resolvedPath + '.js')) {
          return p1 + p2 + '.js' + p3;
        } else if (fs.existsSync(path.join(resolvedPath, 'index.js'))) {
          return p1 + p2 + '/index.js' + p3;
        }
        return match;
      });
      if (updated !== content) {
        fs.writeFileSync(full, updated, 'utf8');
      }
    }
  }
}

walk(base);
console.log('[fix-imports] ESM relative imports validated and patched.');
