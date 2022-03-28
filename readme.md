# Mini Dice V1 Source Code

## Highlights

- HTTP 기반 웹 서비스
- Oauth 또는 '임시 인증'을 통한 회원 가입
  - 서비스에 접속한 유저는 Google 등의 Oauth Provider를 통해 인증을 거친 후 서비스에 가입/로그인할 수 있음.
  - 또는, 인증하지 않고 Hcaptcha 서비스를 통해 유저가 스팸 유저인지만 확인한 후 서비스에 가입/로그인할 수 있음.
- NestJS, Fastify로 구축된 API 서버, MySQL와 Redis에 서버 데이터 저장
- React, Tailwind CSS, Recoil로 구축된 웹 애플리케이션

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
  - scenario-routing(@packages/scenario-routing): Typescript를 통해 객체의 구조를 쉽게 정의해주는 개발 편의용 코드들을 저장함
  - shared-types(@packages/shared-types): 시스템 내에서 공통적으로 사용되는 VO / DTO / 함수들을 저장함

### Tooling

- Yarn Workspace (Yarn Classic) 사용, Lerna 사용 (기본 제공 커맨드 외 커맨드는 사용 지양)
- Prettier, ESLint 사용
- @apps/server
  - NestJS CLI로 빌드 / 실행
- @apps/web
  - Parcel로 빌드 / 웹 서버 실행
