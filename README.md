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

## License

Released under the MIT License. See [LICENSE](LICENSE).
