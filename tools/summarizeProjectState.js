import fs from 'fs'

export default {
  summarizeProjectState: {
    description: 'Summarize style guide, tools and design log entries',
    run: async () => {
      const style = fs.existsSync('./public/docs/styleguide.json')
        ? JSON.parse(fs.readFileSync('./public/docs/styleguide.json', 'utf-8'))
        : {}
      const log = fs.existsSync('./designlog.json')
        ? JSON.parse(fs.readFileSync('./designlog.json', 'utf-8'))
        : []
      const tools = fs.readdirSync('./tools').filter(f => f.endsWith('.js'))
      return { style, designEntries: log.length, tools }
    }
  }
}
