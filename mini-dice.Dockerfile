# 1. npm 패키지를 모두 설치한 이미지 1개를 생성함
FROM node:16
WORKDIR /app

ENV NODE_ENV=production
ENV APP_ENV=dev

COPY . .

RUN yarn install --prod


RUN yarn workspace @apps/server build

WORKDIR /app/apps/server

CMD ["node", "./dist/apps/server/src/main.js"]
EXPOSE 80
