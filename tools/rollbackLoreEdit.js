import fs from 'fs'

const logFile = './version_log.json'

export default {
  rollbackLoreEdit: {
    description: 'Undo the most recent lore edit recorded in version_log.json',
    run: async () => {
      if (!fs.existsSync(logFile)) return { error: 'No version history' }
      const log = JSON.parse(fs.readFileSync(logFile, 'utf-8'))
      if (!log.length) return { error: 'No version history' }
      const last = log.pop()
      fs.writeFileSync(logFile, JSON.stringify(log, null, 2))
      return { rolledBack: last }
    }
  }
}
