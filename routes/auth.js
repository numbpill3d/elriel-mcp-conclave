import express from 'express'
import passport from 'passport'
import OAuth2Strategy from 'passport-oauth2'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const router = express.Router()
router.use(cookieParser())

const {
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_AUTH_URL,
  OAUTH_TOKEN_URL,
  OAUTH_CALLBACK_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_AUTH_URL,
  GITHUB_TOKEN_URL,
  GITHUB_CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_AUTH_URL,
  GOOGLE_TOKEN_URL,
  GOOGLE_CALLBACK_URL,
  JWT_SECRET
} = process.env

let defaultRegistered = false

function registerProvider(name, cfg, makeDefault = false) {
  passport.use(name, new OAuth2Strategy({
    authorizationURL: cfg.authURL,
    tokenURL: cfg.tokenURL,
    clientID: cfg.clientID,
    clientSecret: cfg.clientSecret,
    callbackURL: cfg.callbackURL
  }, (accessToken, refreshToken, profile, cb) => cb(null, { accessToken })))
  const loginPath = `/login/${name}`
  const callbackPath = `/oauth/${name}/callback`

  const doAuth = passport.authenticate(name)
  const doCallback = passport.authenticate(name, { failureRedirect: '/' })

  router.get(loginPath, doAuth)
  router.get(callbackPath, (req, res, next) => {
    doCallback(req, res, () => {
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is required')
      }
      const token = jwt.sign({ access: req.user.accessToken }, JWT_SECRET, { expiresIn: '1h' })
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
      res.redirect('/')
    })
  })

  console.log(`OAuth provider '${name}' configured${makeDefault ? ' (default)' : ''}`)

  const handleAuthSuccess = (req, res) => {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required')
    }
    const token = jwt.sign({ access: req.user.accessToken }, JWT_SECRET, { expiresIn: '1h' })
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
    res.redirect('/')
  }

  if (makeDefault && !defaultRegistered) {
    defaultRegistered = true
    router.get('/login', doAuth)
    router.get('/oauth/callback', (req, res, next) => {
      doCallback(req, res, () => handleAuthSuccess(req, res))
    })
  }
}

const oauthConfigured = OAUTH_CLIENT_ID && OAUTH_CLIENT_SECRET &&
  OAUTH_AUTH_URL && OAUTH_TOKEN_URL && OAUTH_CALLBACK_URL
if (oauthConfigured) {
  registerProvider('oauth2', {
    authURL: OAUTH_AUTH_URL,
    tokenURL: OAUTH_TOKEN_URL,
    clientID: OAUTH_CLIENT_ID,
    clientSecret: OAUTH_CLIENT_SECRET,
    callbackURL: OAUTH_CALLBACK_URL
  }, true)
}

const googleConfigured = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET &&
  GOOGLE_AUTH_URL && GOOGLE_TOKEN_URL && GOOGLE_CALLBACK_URL
if (googleConfigured) {
  registerProvider('google', {
    authURL: GOOGLE_AUTH_URL,
    tokenURL: GOOGLE_TOKEN_URL,
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL
  }, !oauthConfigured)
}

const githubConfigured = GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET &&
  GITHUB_AUTH_URL && GITHUB_TOKEN_URL && GITHUB_CALLBACK_URL
if (githubConfigured) {
  registerProvider('github', {
    authURL: GITHUB_AUTH_URL,
    tokenURL: GITHUB_TOKEN_URL,
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: GITHUB_CALLBACK_URL
  }, !oauthConfigured && !googleConfigured)
}

if (!oauthConfigured && !googleConfigured && !githubConfigured) {
  console.warn('OAuth2 not configured; /login route disabled')
}


passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((obj, cb) => cb(null, obj))

// Registration endpoint (simple placeholder)
import bcrypt from 'bcrypt'

const users = {}

router.post('/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' })
  const hashedPassword = await bcrypt.hash(password, 10)
  users[username] = { password: hashedPassword }
  res.status(201).json({ ok: true })
})


// Log out by clearing the token cookie
router.post('/logout', (req, res, next) => {
  res.clearCookie('token');
  req.logout((err) => {
    if (err) { return next(err); }
    res.json({ ok: true });
  });
})

// Auth status check

router.get('/check_auth', (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]
if (!token || !JWT_SECRET) return res.json({ ok: false })

  try {
    jwt.verify(token, JWT_SECRET)
    res.json({ ok: true })
  } catch {
    res.json({ ok: false })
  }
})

export default router
