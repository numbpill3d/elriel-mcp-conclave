import fs from 'fs'
import path from 'path'

function scan(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (['node_modules', '.git'].includes(e.name)) continue
      scan(full, results)
    } else if (e.name.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf-8')
      if (content.includes('<<<<<<<') || content.includes('>>>>>>>')) {
        results.push({ file: full, issue: 'merge conflict markers' })
      }
      if (content.match(/TODO/)) {
        results.push({ file: full, issue: 'TODO present' })
      }
    }
  }
  return results
}

export default {
  scanForBugsAndConflicts: {
    description: 'Perform a simple static scan for TODOs and merge markers',
    run: async () => scan('.')
  }
}
