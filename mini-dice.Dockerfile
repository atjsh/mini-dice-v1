# 1. npm 패키지를 모두 설치한 이미지 1개를 생성함
FROM node:17.9
WORKDIR /app
RUN apt-get update || : && apt-get install -y \
    python3.9 \
    build-essential

ENV APP_ENV=dev

COPY . .

RUN yarn workspaces focus @apps/server


RUN yarn workspace @apps/server build

WORKDIR /app/apps/server

CMD ["node", "./dist/apps/server/src/main.js"]
EXPOSE 80
