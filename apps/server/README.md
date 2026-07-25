# @apps/server

NestJS Server Application for Mini Dice V1

Run commands from the repository root after installing Node.js 24.18.0 and npm
11.16.0:

```sh
npm ci --strict-peer-deps
npm run packages:build
npm run server:typecheck
npm run server:build
npm run server:dev
```

The deployment bundle targets the AWS Lambda `nodejs24.x` runtime. Serverless
Framework 3 emits a known schema warning for that runtime; verify the generated
CloudFormation runtime before deploying with `npm run server:deploy`.

Serverless Offline 13's cookie response bug is covered by the local
`serverless-offline-cookie-compat.cjs` plugin. The shim is guarded to Serverless
`3.40.0`, Offline `13.10.1`, Hapi `21.4.9`, and Statehood `8.2.1`, runs only for
Offline lifecycle hooks, and is excluded from the Lambda artifact. When
upgrading to Offline 14 or newer, delete the plugin and remove its
`serverless.yml` entry after confirming the upstream cookie parser handles the
refresh-cookie issuance and deletion flows.

The shim intentionally preserves the production `Secure; SameSite=None`
attributes. Safari may therefore refuse the refresh cookie over plain
`http://localhost`; use the AWS testing stage or trusted local HTTPS for
end-to-end Safari authentication.
