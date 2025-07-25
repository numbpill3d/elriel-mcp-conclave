import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import helmet from 'helmet'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { RedisStore } from 'connect-redis'
import { createClient as createRedisClient } from 'redis'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.js'

const app = express()
const port = process.env.PORT || 3000

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(helmet())
app.use(express.json())
const cookieParser = require('cookie-parser')
app.use(cookieParser())

let sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET environment variable is required in production')
  } else {
    sessionSecret = 'dev_session_secret'
    console.warn('SESSION_SECRET not set, using insecure development secret')
  }
} else {
  console.log('Using SESSION_SECRET from environment')
}

}

let sessionStore
if (process.env.MONGO_URI) {
  sessionStore = MongoStore.create({ mongoUrl: process.env.MONGO_URI })
  console.log('Using MongoDB session store')
} else if (process.env.REDIS_URL) {
  const redisClient = createRedisClient({ url: process.env.REDIS_URL })
  await redisClient.connect()
  sessionStore = new RedisStore({ client: redisClient })
  console.log('Using Redis session store')
} else {
  sessionStore = new session.MemoryStore()
  console.warn('Using in-memory session store; not recommended for production')
}

app.use(session({
  secret: sessionSecret,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production' }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static('public', { dotfiles: 'allow' }))
app.use(authRoutes)

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = req.cookies?.token || (header.startsWith('Bearer ') ? header.split(' ')[1] : null)
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

app.use('/tools', requireAuth)

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
