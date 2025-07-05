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
- `GET /login` – start the OAuth2 flow and redirect to the provider.
- `GET /oauth/callback` – handle the provider's response and set a `token` cookie.
- `GET /check_auth` – verify the current login state, returns `{ ok: true }` when authenticated.
- **Log out** – clear the `token` cookie in your browser to remove the session.

## License

Released under the MIT License. See [LICENSE](LICENSE).
