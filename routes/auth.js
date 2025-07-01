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

passport.use(new OAuth2Strategy({
  authorizationURL: OAUTH_AUTH_URL,
  tokenURL: OAUTH_TOKEN_URL,
  clientID: OAUTH_CLIENT_ID,
  clientSecret: OAUTH_CLIENT_SECRET,
  callbackURL: OAUTH_CALLBACK_URL
}, (accessToken, refreshToken, profile, cb) => {
  return cb(null, { accessToken })
}))

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

router.get('/login', passport.authenticate('oauth2'))

router.get('/oauth/callback', passport.authenticate('oauth2', { failureRedirect: '/' }), (req, res) => {
  const token = jwt.sign({ access: req.user.accessToken }, JWT_SECRET, { expiresIn: '1h' })
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
  res.redirect('/')
})

router.get('/check_auth', (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]
  if (!token) return res.json({ ok: false })
  try {
    jwt.verify(token, JWT_SECRET)
    res.json({ ok: true })
  } catch {
    res.json({ ok: false })
  }
})

export default router
