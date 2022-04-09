# 1. npm 패키지를 모두 설치한 이미지 1개를 생성함
FROM node:16 as installed
WORKDIR /app

COPY . .

RUN yarn


# 2. 번들링함.
FROM installed as built
WORKDIR /app

RUN yarn workspace @apps/server build

RUN  ls -la
RUN pwd

# 번들링된 프로젝트를 실행함.
FROM installed
WORKDIR /app

ENV NODE_ENV=prod

RUN  ls -la
RUN pwd

COPY --from=built /app/apps/server/dist ./dist
COPY --from=built /app/apps/server/tdol-process.env.dev ./

CMD ["node", "dist/apps/server/dist/apps/server/src/main.js"]
EXPOSE 7000
