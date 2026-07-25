# Mini Dice V1 Source Code

[![Mini Dice Logo](./md/logo.png)](https://www.mini-dice.com)

[mini-dice.com](https://www.mini-dice.com)에서 지금 바로 플레이 가능.

## What is Mini Dice?

주사위를 굴리며 맵을 모험하고 코인을 벌어 순위에 오르는 것이 목표인 웹 게임.

## Highlights

- HTTP 기반 웹 서비스
- 유저 인증: 소셜 계정 기반 OAuth, 또는 HCaptcha 검사 통과자의 익명 계정 허용
- NestJS, Fastify로 구축된 API 서버.
- React, Tailwind CSS, Jotai로 구축된 웹 애플리케이션
- PostgreSQL 데이터베이스 사용
- AWS Lambda를 컴퓨팅 인프라스트럭쳐로 사용
- esbuild를 서버 코드 번들러로 사용하여 서버리스 환경에 최적화된 아티팩트 생성
- Github Actions를 통한 CI/CD 파이프라인 구축
- 모노리포 구조로 관리되는 코드베이스

[더 알아보기](https://blog.atj.sh/post/8)

## Development

This repository uses native npm workspaces. Install Node.js 24.18.0 and npm
11.16.0, then install the workspace from the repository root:

```sh
npm ci --strict-peer-deps
```

Common commands:

```sh
npm run packages:build
npm run server:dev
npm run web:dev
npm run admin-server:dev
npm run admin-server:build
npm run admin-dashboard-server:dev
npm run admin-dashboard-server:build
npm run admin-dashboard-web:dev
npm run admin-dashboard-web:build
npm run admin-dashboard-web:preview
npm run typecheck
npm run typecheck:ts6
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run check
```

`typecheck` uses TypeScript 7. `typecheck:ts6` is the transitional
compatibility check for tools that still consume the TypeScript compiler API.
`lint` runs the type-aware typescript-eslint rules, while `format:check` runs
Prettier independently. `check` runs both checks followed by the TS7 and TS6
workspace typechecks.
Run an individual workspace command with
`npm run <script> --workspace=<workspace-name>`.

These named npm scripts replace the former Yarn workspace wrappers. In
particular, use `admin-server:*` for the Nest administration service,
`admin-dashboard-server:*` for the Hono API, and `admin-dashboard-web:*` for
the administration frontend.

# Copyright

Copyright (c) 2022-2026 전성훈 (Sunghoon Jeon) All rights reserved.

Copyright (c) 2022-2026 Miyobi All rights reserved.

Copyright (c) 2022-2026 Mini Dice Contributors All rights reserved. See more at [contributors graph](https://github.com/atjsh/mini-dice-v1/graphs/contributors).

Other copyrights are the property of their respective owners. You can check the original author of the code in the source code & commit history.
