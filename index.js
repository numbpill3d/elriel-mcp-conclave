// index.js
import express from 'express'
import cors from 'cors'

import assetRegistry from './tools/assetRegistry.js'
import saveStateDB from './tools/saveStateDB.js'
import inspectGLTF from './tools/inspectGLTF.js'
import renderSceneHTML from './tools/renderSceneHTML.js'
import npcBrain from './tools/npcBrain.js'
import shaderCheck from './tools/shaderCheck.js'
import convertModel from './tools/convertModel.js'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const tools = {
  ...assetRegistry,
  ...saveStateDB,
  ...inspectGLTF,
  ...renderSceneHTML,
  ...npcBrain,
  ...shaderCheck,
  ...convertModel
}

app.get('/tools', (req, res) => {
  res.json({
    tools: Object.keys(tools).map((key) => ({
      name: key,
      description: tools[key].description
    }))
  })
})

app.post('/tools/:tool', async (req, res) => {
  const toolName = req.params.tool
  const tool = tools[toolName]
  if (!tool) return res.status(404).send({ error: 'Tool not found' })
  try {
    const result = await tool.run(req.body.input || {})
    res.json({ output: result })
  } catch (e) {
    res.status(500).json({ error: e.toString() })
  }
})

app.get('/', (req, res) => {
  res.send('Claude MCP Tool Server is running.')
})

app.listen(port, () => {
  console.log(`MCP server running on port ${port}`)
})
