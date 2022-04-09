docker run --name minidice-dev-redis -p $REDIS_PORT:6379 -d redis:7.0-rc3 redis-server --requirepass $REDIS_PASSWORD
