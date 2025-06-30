import fs from 'fs'

export default {
  suggestNextStep: {
    description: 'Suggest the next development task based on design log',
    run: async () => {
      const log = fs.existsSync('./designlog.json')
        ? JSON.parse(fs.readFileSync('./designlog.json', 'utf-8'))
        : []
      const last = log[log.length - 1]
      if (!last) return { suggestion: 'Add initial design decisions' }
      return { suggestion: `Continue work expanding on: ${last.decision}` }
    }
  }
}
