import fs from 'fs'

const logFile = './designlog.json'

function readLog() {
  if (!fs.existsSync(logFile)) return []
  return JSON.parse(fs.readFileSync(logFile, 'utf-8'))
}

export default {
  logDesignDecision: {
    description: 'Append a design decision entry to designlog.json',
    run: async ({ decision }) => {
      const log = readLog()
      log.push({ time: new Date().toISOString(), decision })
      fs.writeFileSync(logFile, JSON.stringify(log, null, 2))
      return { entries: log.length }
    }
  }
}
