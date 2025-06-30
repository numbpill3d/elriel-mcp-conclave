import fs from 'fs'

export default {
  getStyleGuide: {
    description: "Returns the full world aesthetic guide for UI and Three.js visuals.",
    run: async () => {
      return JSON.parse(fs.readFileSync('./public/docs/styleguide.json', 'utf-8'))
    }
  }
}
