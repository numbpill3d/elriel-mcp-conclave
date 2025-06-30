import fs from 'fs'
import path from 'path'

function collectFiles(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (['node_modules', '.git'].includes(e.name)) continue
      collectFiles(full, out)
    } else if (e.name.endsWith('.js') || e.name.endsWith('.json')) {
      out.push({ path: full, content: fs.readFileSync(full, 'utf-8') })
    }
  }
  return out
}

export default {
  getCurrentProjectFiles: {
    description: 'Return the contents of all .js and .json files in the repo',
    run: async () => collectFiles('.')
  }
}
