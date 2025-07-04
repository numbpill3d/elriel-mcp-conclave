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
  JWT_SECRET
} = process.env

const oauthConfigured = OAUTH_CLIENT_ID && OAUTH_CLIENT_SECRET &&
  OAUTH_AUTH_URL && OAUTH_TOKEN_URL && OAUTH_CALLBACK_URL

if (oauthConfigured) {
  passport.use(new OAuth2Strategy({
    authorizationURL: OAUTH_AUTH_URL,
    tokenURL: OAUTH_TOKEN_URL,
    clientID: OAUTH_CLIENT_ID,
    clientSecret: OAUTH_CLIENT_SECRET,
    callbackURL: OAUTH_CALLBACK_URL
  }, (accessToken, refreshToken, profile, cb) => {
    return cb(null, { accessToken })
  }))
} else {
  console.warn('OAuth2 not configured; auth routes will be disabled')
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

router.get('/login', (req, res, next) => {
  if (!oauthConfigured) return res.status(501).json({ error: 'OAuth not configured' })
  passport.authenticate('oauth2')(req, res, next)
})

router.get('/oauth/callback', (req, res, next) => {
  if (!oauthConfigured) return res.status(501).json({ error: 'OAuth not configured' })
  passport.authenticate('oauth2', { failureRedirect: '/' })(req, res, () => {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required')
    }
    const token = jwt.sign({ access: req.user.accessToken }, JWT_SECRET, { expiresIn: '1h' })
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
    res.redirect('/')
  })
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
