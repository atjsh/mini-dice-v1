# Mini Dice Web

The public web application is a React 19 and Vite 8 workspace built from the
repository's root npm installation.

## Requirements

- Node.js 24.18.0
- npm 11.16.0

Install all workspaces from the repository root:

```sh
npm ci --strict-peer-deps
```

## Commands

Run these commands from the repository root:

```sh
npm run dev -w @apps/web
npm run typecheck -w @apps/web
npm run build -w @apps/web
npm run preview -w @apps/web
```

Development and production builds initialize the passkey authenticator AAGUID
submodule before starting Vite. The development server listens on
`http://127.0.0.1:1234`.

The supported browser floor is Safari 16.4+, Chrome 111+, and Firefox 128+.
