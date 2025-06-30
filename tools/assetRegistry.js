import fs from 'fs'
import path from 'path'

const assetsPath = './public/assets' // make sure this folder exists

export default {
  listAssets: {
    description: "List all 3D assets in the asset folder.",
    run: async () => {
      const files = fs.readdirSync(assetsPath)
      return files.map(f => ({ name: f, type: path.extname(f).replace('.', '') }))
    }
  },
  getAssetMetadata: {
    description: "Return sample metadata for a 3D asset.",
    run: async ({ path }) => {
      return {
        path,
        polycount: 3480,
        format: 'glb',
        usedInScenes: ['cloudlands', 'testScene']
      }
    }
  }
}
