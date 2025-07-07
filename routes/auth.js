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

function registerProvider(name, cfg) {
  passport.use(name, new OAuth2Strategy({
    authorizationURL: cfg.authURL,
    tokenURL: cfg.tokenURL,
    clientID: cfg.clientID,
    clientSecret: cfg.clientSecret,
    callbackURL: cfg.callbackURL
  }, (accessToken, refreshToken, profile, cb) => cb(null, { accessToken })))

  const loginPath = name === 'oauth2' ? '/login' : `/login/${name}`
  const callbackPath = name === 'oauth2' ? '/oauth/callback' : `/oauth/${name}/callback`

  router.get(loginPath, (req, res, next) => {
    passport.authenticate(name)(req, res, next)
  })

  router.get(callbackPath, (req, res, next) => {
    passport.authenticate(name, { failureRedirect: '/' })(req, res, () => {
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is required')
      }
      const token = jwt.sign({ access: req.user.accessToken }, JWT_SECRET, { expiresIn: '1h' })
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
      res.redirect('/')
    })
  })
}

const oauthConfigured = OAUTH_CLIENT_ID && OAUTH_CLIENT_SECRET &&
  OAUTH_AUTH_URL && OAUTH_TOKEN_URL && OAUTH_CALLBACK_URL
let defaultProvider = null
if (oauthConfigured) {
  registerProvider('oauth2', {
    authURL: OAUTH_AUTH_URL,
    tokenURL: OAUTH_TOKEN_URL,
    clientID: OAUTH_CLIENT_ID,
    clientSecret: OAUTH_CLIENT_SECRET,
    callbackURL: OAUTH_CALLBACK_URL
  })
  defaultProvider = 'oauth2'
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
  })
  if (!defaultProvider) defaultProvider = 'github'
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
  })
  if (!defaultProvider) defaultProvider = 'google'
}

if (defaultProvider) {
  if (!oauthConfigured) {
    router.get('/login', (req, res) => res.redirect(`/login/${defaultProvider}`))
    router.get('/oauth/callback', (req, res) => res.redirect(`/oauth/${defaultProvider}/callback`))
  }
  console.log(`/login route enabled using ${defaultProvider} OAuth2 provider`)
} else {
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
