import { execSync } from 'child_process'
import fs from 'fs'

export default {
  compareWithPreviousVersion: {
    description: 'Return current and previous versions of a file from git',
    run: async ({ file }) => {
      try {
        const previous = execSync(`git show HEAD~1:${file}`, { encoding: 'utf-8' })
        const current = fs.readFileSync(file, 'utf-8')
        return { previous, current }
      } catch (e) {
        return { error: e.toString() }
      }
    }
  }
}
