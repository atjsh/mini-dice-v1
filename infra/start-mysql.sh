docker run --name minidice-dev-mysql -v /home/pi/mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD -d -p $MYSQL_ROOT_PORT:3306 arm64v8/mysql:8-oracle
