# Ohbug 部署

## 环境变量

可通过配置环境变量文件控制相关配置（推荐），也可直接修改根目录下 `config.js`。

```
# env 模板

# typeorm 相关配置
TYPEORM_CONNECTION=postgres
TYPEORM_HOST=localhost
TYPEORM_PORT=5432
TYPEORM_DATABASE=ohbug
TYPEORM_USERNAME=postgres
TYPEORM_PASSWORD=ohbug_postgres_password

# elasticsearch 相关配置
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme

# kafka nodes
KAFKA_NODES=localhost:9092

# redis 相关配置
REDIS_HOST=localhost
REDIS_PORT=6379

# 用户密码加盐
USER_PASSWORD_SALT=ohbug_user_password_salt

# github oauth2 登录需要的配置
OAUTH_GITHUB_CLIENT_ID=YOUR_CLIENT_ID
OAUTH_GITHUB_CLIENT_SECRET=YOUR_CLIENT_SECRET

# jwt 相关配置
JWT_SECRET=YOUR_JWT_SECRET
JWT_EXPIRES_IN=2592000000

# apiKey 加密用到的 secret
APP_SECRET=YOUR_APP_SECRET

# sourceMap 上传的位置
UPLOAD_SOURCEMAP_FILE_PATH=./uploads

# email 发送相关配置
EMAIL_NOTICE_HOST=YOUR_EMAIL_NOTICE_HOST
EMAIL_NOTICE_PORT=YOUR_EMAIL_NOTICE_PORT
EMAIL_NOTICE_SECURE=YOUR_EMAIL_NOTICE_SECURE
EMAIL_NOTICE_AUTH_USER=YOUR_EMAIL_NOTICE_AUTH_USER
EMAIL_NOTICE_AUTH_PASS=YOUR_EMAIL_NOTICE_AUTH_PASS

# webpush 相关配置
WEBPUSH_PUBLIC_KEY=YOUR_WEBPUSH_PUBLIC_KEY
WEBPUSH_PRIVATE_KEY=YOUR_WEBPUSH_PRIVATE_KEY

# 数据过期清理的间隔时间
TIME_INTERVAL_FOR_CLEANING_UP_EXPIRED_DATA=30

# 可允许储存的 event 的最大数量
EVENT_MAX=1000
```

## 普通搭建

使用 npm 安装依赖可能出现问题，请使用 [yarn](https://yarnpkg.com/) 代替 npm 安装依赖。

1. clone 仓库

```shell
git clone git@github.com:ohbug-org/ohbug-server.git
```

2. 安装依赖

```shell
cd ohbug-server && yarn && yarn bootstrap
```

3. 配置环境变量 .env.development(开发环境)/.env.production(生产环境) 或直接配置 `config.js`。

4. 开发环境调试

```shell
yarn start
```

5. 生产环境部署
   生产环境使用 pm2 启动

```shell
yarn global add pm2
```

构建生产环境代码

```shell
yarn build
```

开启生产环境

```shell
yarn start:prod
```

注意：以上步骤仅搭建后端服务内容，数据库等服务需自行搭建，推荐使用 docker 部署一步到位。

## Docker 一步到位搭建（推荐）

1. 配置环境变量 `.env.production`
2. 配置 `docker-compose.yml`，推荐使用 [docker-compose 模板](./docker/docker-compose.prod.yml)，默认包含部署所需要的所有服务，可自行修改。
3. 创建文件 `docker_env.sh` 输入以下内容，并且执行 `source docker_env.sh` （这一步目的是为配置 docker 内 kafka，若自有 kafka 可自行选择是否忽略）

```bash
#!/bin/bash

export DOCKER_HOST_IP=$(ip route get 1 | awk '{print $(NF-2);exit}')
```

4. 执行 `docker-compose -f docker-compose.yml up --build -d`

## 联系

微信号：`hello_ohbug`

请备注 `ohbug 部署`

<img width="300" src="https://raw.githubusercontent.com/ohbug-org/ohbug-website/master/static/images/qrcode.png" alt="qrcode">
