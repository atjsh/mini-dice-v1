# 1. npm 패키지를 모두 설치한 이미지 1개를 생성함
FROM node:16-alpine as installed
RUN apk update
WORKDIR /app

COPY . .

RUN yarn

# 2. 번들링함.
FROM installer as built
WORKDIR /app

RUN yarn workspace @apps/server build

# 번들링된 프로젝트를 실행함.
FROM installer
WORKDIR /app

ENV NODE_ENV=prod

COPY --from=built /apps/server/dist ./dist
COPY --from=builder /apps/server/tdol-process.env.dev ./

CMD ["node", "dist/apps/server/dist/apps/server/src/main.js"]
EXPOSE 7000
