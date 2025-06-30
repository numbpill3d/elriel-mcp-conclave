import fs from 'fs'
import https from 'https'
import path from 'path'

export default {
  fetchAndStoreRemoteAsset: {
    description: "Downloads a file from a remote URL and stores it in the public assets folder under a chosen name.",
    run: async ({ url, filename }) => {
      return new Promise((resolve, reject) => {
        const filePath = path.resolve('./public/assets/', filename)
        const file = fs.createWriteStream(filePath)

        https.get(url, response => {
          if (response.statusCode !== 200) return reject(`Failed to fetch: ${response.statusCode}`)
          response.pipe(file)
          file.on('finish', () => {
            file.close(() => resolve({ success: true, path: `/assets/${filename}` }))
          })
        }).on('error', err => {
          fs.unlink(filePath, () => reject(err.message))
        })
      })
    }
  }
}
