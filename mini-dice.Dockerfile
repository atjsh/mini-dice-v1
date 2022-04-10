# 1. npm 패키지를 모두 설치한 이미지 1개를 생성함
FROM node:16 as installed
WORKDIR /app

COPY . .

RUN yarn install --prod


# 2. 번들링함.
FROM installed as built
WORKDIR /app

RUN yarn workspace @apps/server build


# 번들링된 프로젝트를 실행함.
FROM installed
WORKDIR /app

ENV NODE_ENV=production
ENV APP_ENV=dev


COPY --from=built /app/apps/server/dist ./dist
COPY --from=built /app/apps/server/tdol-process.env.dev ./

CMD ["node", "dist/apps/server/src/main.js"]
EXPOSE 80
