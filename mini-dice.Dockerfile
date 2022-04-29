# 1. npm 패키지를 모두 설치한 이미지 1개를 생성함
FROM nikolaik/python-nodejs:python3.10-nodejs17-slim
WORKDIR /app

ENV APP_ENV=dev

COPY . .

RUN yarn install


RUN yarn workspace @apps/server build

WORKDIR /app/apps/server

CMD ["node", "./dist/apps/server/src/main.js"]
EXPOSE 80
