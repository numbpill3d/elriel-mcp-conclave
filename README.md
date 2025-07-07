# Claude MCP Tool Server

This repository provides a lightweight HTTP server exposing a collection of tools used by the Claude MCP project. Tools include asset management, world simulation helpers and small utilities for building Three.js scenes.

## Requirements

- Node.js 18+ (tested with Node 20)

## Installation

Install dependencies:

```bash
npm install
```

## Running

Start the server:

```bash
npm start
```

The server defaults to port `3000`. You may set the `PORT` environment variable to override the port.

Before running the server, copy `.env.example` to `.env` and provide values for
`JWT_SECRET` and **optionally** `SESSION_SECRET`. If `SESSION_SECRET` is not set
a development default will be used with a warning. To enable persistent session
storage for production, set either `REDIS_URL` or `MONGO_URI`. If you plan to
use OAuth2 login, also fill in the provider variables with your details:

```bash
cp .env.example .env
# edit .env with your secret values
# SESSION_SECRET=replace_me
# OAUTH_CLIENT_ID=...
# OAUTH_CLIENT_SECRET=...
# OAUTH_AUTH_URL=https://provider.com/oauth/authorize
# OAUTH_TOKEN_URL=https://provider.com/oauth/token
# OAUTH_CALLBACK_URL=http://localhost:3000/oauth/callback
# MONGO_URI=mongodb://user:pass@host/db
# REDIS_URL=redis://localhost:6379
# GITHUB_CLIENT_ID=...
# GITHUB_CLIENT_SECRET=...
# GITHUB_AUTH_URL=...
# GITHUB_TOKEN_URL=...
# GITHUB_CALLBACK_URL=https://elriel-mcp-conclave.onrender.com/oauth/github/callback
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GOOGLE_AUTH_URL=...
# GOOGLE_TOKEN_URL=...
# GOOGLE_CALLBACK_URL=https://elriel-mcp-conclave.onrender.com/oauth/google/callback
```

Example values for deployment on Render:

```bash
CORS_ORIGIN=https://elriel-mcp-conclave.onrender.com
OAUTH_CALLBACK_URL=https://elriel-mcp-conclave.onrender.com/oauth/callback
# MONGO_URI=your-production-mongo-uri
# REDIS_URL=your-production-redis-url
```

## Usage

All JavaScript modules inside the `tools/` directory are automatically loaded and exposed via HTTP.

List tools:

```
GET /tools
```


Run a tool by POSTing JSON with an `input` object:

```
POST /tools/<tool-name>
```

Static assets live under `public/assets/`. Additional folders such as `scenes/`, `shaders/` and `ui/` are provided for future content and kept in version control using `.gitkeep` files.

See `public/.well-known/openapi.json` for the minimal API specification.

## Authentication

Authentication routes require the environment variables described in `.env` to be configured. Set your session secrets and OAuth provider details before using them.

- `POST /register` – register a new username and password.
### OAuth2 Endpoints

#### Generic OAuth2 (when `OAUTH_*` variables are configured)
- `GET /login` – Start the generic OAuth2 login flow.
- `GET /oauth/callback` – Handle the generic provider's response and set a `token` cookie.

#### GitHub OAuth
- `GET /login/github` – Begin the GitHub OAuth login flow.
- `GET /oauth/github/callback` – Handle the GitHub OAuth callback.

#### Google OAuth
- `GET /login/google` – Begin the Google OAuth login flow.
- `GET /oauth/google/callback` – Handle the Google OAuth callback.

#### Discord OAuth
- `GET /login/discord` – Begin the Discord OAuth login flow.
- `GET /oauth/discord/callback` – Handle the Discord OAuth callback.

- `GET /check_auth` – verify the current login state, returns `{ ok: true }` when authenticated.
- **Log out** – clear the `token` cookie in your browser to remove the session.

## License

Released under the MIT License. See [LICENSE](LICENSE).
