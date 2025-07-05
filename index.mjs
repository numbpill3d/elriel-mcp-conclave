import express from 'express'
import cors from 'cors'
import fs from 'fs'
import helmet from 'helmet'
import session from 'express-session'
import passport from 'passport'
import { config } from 'dotenv'
import authRoutes from './routes/auth.mjs'

config()

const app = express()
const port = process.env.PORT || 3000

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(helmet())
app.use(express.json())
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === 'change_me') {
  throw new Error('SESSION_SECRET must be set to a secure value')
}
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production' }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static('public', { dotfiles: 'allow' }))
app.use(authRoutes)

const tools = {}
const toolFiles = fs.readdirSync('./tools').filter(f => f.endsWith('.js'))
for (const file of toolFiles) {
  const mod = await import(`./tools/${file}`)
  Object.assign(tools, mod.default || {})
}

// Tool Usage Logger
app.use((req, res, next) => {
  if (req.method === 'POST' && req.url.startsWith('/tools/')) {
    const toolName = req.url.split('/')[2]
    const timestamp = new Date().toISOString()
    const log = `[${timestamp}] Tool used: ${toolName}\n`
    try {
      fs.appendFileSync('tool_usage.log', log)
    } catch (err) {
      console.error('Failed to write usage log', err)
    }
  }
  next()
})

// Version Control Middleware for Lore Editing
const versionLog = './version_log.json'
if (!fs.existsSync(versionLog)) fs.writeFileSync(versionLog, JSON.stringify([]))

function logVersionChange(tool, input) {
  const history = JSON.parse(fs.readFileSync(versionLog, 'utf-8'))
  history.push({ time: new Date().toISOString(), tool, input })
  try {
    fs.writeFileSync(versionLog, JSON.stringify(history, null, 2))
  } catch (err) {
    console.error('Failed to update version log', err)
  }
}

app.post('/tools/:tool', async (req, res) => {
  const toolName = req.params.tool
  const tool = tools[toolName]
  if (!tool) return res.status(404).send({ error: 'Tool not found' })
  try {
    const input = req.body.input || {}
    const result = await tool.run(input)
    if (toolName.includes('add') || toolName.includes('update')) {
      logVersionChange(toolName, input)
    }
    res.json({ output: result })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/tools', (req, res) => {
  res.json({
    tools: Object.keys(tools).map(key => ({ name: key, description: tools[key].description }))
  })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/.well-known/mcp/metadata', (req, res) => {
  res.json({
    tools: Object.keys(tools).map(key => ({ name: key, description: tools[key].description }))
  })
})

app.get('/', (req, res) => {
  res.send('Claude MCP Tool Server is running.')
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(port, () => {
  console.log(`MCP server running on port ${port}`)
})
