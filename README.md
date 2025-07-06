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
`SESSION_SECRET` and `JWT_SECRET`. If you plan to use OAuth2 login, also fill in
the `OAUTH_*` variables with your provider details:

```bash
cp .env.example .env
# edit .env with your secret values
# OAUTH_CLIENT_ID=...
# OAUTH_CLIENT_SECRET=...
# OAUTH_AUTH_URL=https://provider.com/oauth/authorize
# OAUTH_TOKEN_URL=https://provider.com/oauth/token
# OAUTH_CALLBACK_URL=http://localhost:3000/oauth/callback
```

Example values for deployment on Render:

```bash
CORS_ORIGIN=https://elriel-mcp-conclave.onrender.com
OAUTH_CALLBACK_URL=https://elriel-mcp-conclave.onrender.com/oauth/callback
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
- `GET /login` – start the default OAuth2 flow.
- `GET /oauth/callback` – handle the provider's response and set a `token` cookie.
- `GET /login/github` – begin GitHub login flow.
- `GET /oauth/github/callback` – GitHub callback path.
- `GET /login/google` – begin Google login flow.
- `GET /oauth/google/callback` – Google callback path.
- `GET /login/discord` – begin Discord login flow.
- `GET /oauth/discord/callback` – Discord callback path.
- `GET /check_auth` – verify the current login state, returns `{ ok: true }` when authenticated.
- **Log out** – clear the `token` cookie in your browser to remove the session.

## License

Released under the MIT License. See [LICENSE](LICENSE).
