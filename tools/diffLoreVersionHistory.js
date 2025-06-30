import fs from 'fs'

const logFile = './version_log.json'

export default {
  diffLoreVersionHistory: {
    description: 'Show the last two lore edits recorded',
    run: async () => {
      if (!fs.existsSync(logFile)) return { error: 'No version history' }
      const log = JSON.parse(fs.readFileSync(logFile, 'utf-8'))
      if (log.length < 2) return { error: 'Not enough history' }
      const [prev, last] = log.slice(-2)
      return { previous: prev, latest: last }
    }
  }
}
