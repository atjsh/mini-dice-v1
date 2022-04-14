# Mini Dice V1 Source Code
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## What is Mini Dice?

- '주사위'를 굴려 맵을 이동하며 가상의 재화를 얻을 수 있고, 랭킹을 통해 다른 유저의 가상 재화 보유 상태를 확인할 수 있도록 하는 웹 서비스

## Highlights

- HTTP 기반 웹 서비스
- 소셜 계정 기반 OAuth 또는 임시 가입을 통한 회원 가입 & 로그인
- NestJS, Fastify로 구축된 API 서버
- React, Tailwind CSS, Recoil로 구축된 웹 애플리케이션
- MySQL와 Redis에 서버 데이터 저장

## Code Spec

### Language & Runtime

- Typescript 4.5
- Node 16

### Code Structure

mini-dice-v1은 NestJS 기반 API 서버와 React 기반 웹 프론트엔드 애플레케이션으로 구성된 시스템이다.

mini-dice-v1 리포지토리는 아래와 같은 구조를 가지고 있다.

- apps
  - server(@apps/server): API 서버 코드 저장
  - web(@apps/web): 웹 프론트엔드 코드 저장
- packages
  - scenario-routing(@packages/scenario-routing): 서비스 내 '맵'을 정의하고 구조화하는 코드를 저장함
  - shared-types(@packages/shared-types): 시스템 내에서 공통적으로 사용되는 코드들을 저장함

### Tooling

- Yarn Workspace (Yarn Classic) 사용, Lerna 사용 (기본 제공 커맨드 외 커맨드는 사용 지양)
- Prettier, ESLint 사용
- @apps/server
  - NestJS CLI로 빌드 / 실행
- @apps/web
  - Parcel로 빌드 / 웹 서버 실행

## Maintainer

- Mini Dice's Source code and Infrastructures are maintained by MDT (Mini Dice Team)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/MuxLee"><img src="https://avatars.githubusercontent.com/u/37520438?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mux</b></sub></a><br /><a href="#tool-MuxLee" title="Tools">🔧</a></td>
    <td align="center"><a href="https://velog.io/@atjsh"><img src="https://avatars.githubusercontent.com/u/35552274?v=4?s=100" width="100px;" alt=""/><br /><sub><b>전성훈 / SUNG HOON CHON</b></sub></a><br /><a href="https://github.com/ATJSH/mini-dice-v1/commits?author=ATJSH" title="Code">💻</a> <a href="#design-ATJSH" title="Design">🎨</a> <a href="#blog-ATJSH" title="Blogposts">📝</a> <a href="https://github.com/ATJSH/mini-dice-v1/commits?author=ATJSH" title="Documentation">📖</a> <a href="#infra-ATJSH" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/hywlss9"><img src="https://avatars.githubusercontent.com/u/37681882?v=4?s=100" width="100px;" alt=""/><br /><sub><b>HyeongJin Park</b></sub></a><br /><a href="#ideas-hywlss9" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ATJSH/mini-dice-v1/commits?author=hywlss9" title="Code">💻</a> <a href="https://github.com/ATJSH/mini-dice-v1/pulls?q=is%3Apr+reviewed-by%3Ahywlss9" title="Reviewed Pull Requests">👀</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!