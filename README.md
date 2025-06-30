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

List all available tools via:

```
GET /tools
```

Run a tool by sending a JSON body containing an `input` object:

```
POST /tools/<tool-name>
```

See `public/.well-known/openapi.json` for the minimal API specification.

## License

Released under the MIT License. See [LICENSE](LICENSE).
