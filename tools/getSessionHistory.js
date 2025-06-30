import fs from 'fs'

export default {
  getSessionHistory: {
    description: 'Return the last 10 tool usages',
    run: async () => {
      if (!fs.existsSync('tool_usage.log')) return []
      const lines = fs.readFileSync('tool_usage.log', 'utf-8').trim().split('\n')
      return lines.slice(-10)
    }
  }
}
