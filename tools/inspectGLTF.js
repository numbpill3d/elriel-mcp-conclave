// /tools/inspectGLTF.js
import fs from 'fs'
import path from 'path'
import { load } from '@loaders.gl/core'
import { GLTFLoader as GLTF2Loader } from '@loaders.gl/gltf'

export default {
  inspectGLTF: {
    description: "Extract basic metadata from a .glb or .gltf file",
    run: async ({ filename }) => {
      const filePath = path.resolve(`./public/assets/${filename}`)
      if (!fs.existsSync(filePath)) throw new Error("File not found")

      const data = await load(filePath, GLTF2Loader)
      const { scenes, nodes, accessors, meshes } = data

      return {
        meshes: meshes?.map(m => ({
          name: m.name,
          primitives: m.primitives?.length || 0
        })),
        nodes: nodes?.map(n => ({ name: n.name, mesh: n.mesh })),
        accessors: accessors?.length,
        totalScenes: scenes?.length
      }
    }
  }
}
