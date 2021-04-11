FROM node:14-buster-slim

LABEL maintainer="chenyueban <jasonchan0527@gmail.com>"

USER root

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git

WORKDIR /usr/src/ohbug

RUN npm install -g pnpm
RUN pnpm install -g pm2

COPY package.json /usr/src/ohbug/package.json
COPY lerna.json /usr/src/ohbug/lerna.json
COPY pnpm-lock.yaml /usr/src/ohbug/pnpm-lock.yaml
COPY pnpm-workspace.yaml /usr/src/ohbug/pnpm-workspace.yaml
COPY packages/app/package.json /usr/src/ohbug/packages/app/package.json
COPY packages/common/package.json /usr/src/ohbug/packages/common/package.json
COPY packages/dashboard/package.json /usr/src/ohbug/packages/dashboard/package.json
COPY packages/manager/package.json /usr/src/ohbug/packages/manager/package.json
COPY packages/notifier/package.json /usr/src/ohbug/packages/notifier/package.json
COPY packages/transfer/package.json /usr/src/ohbug/packages/transfer/package.json
RUN pnpm install
COPY ./ /usr/src/ohbug
RUN pnpm build

EXPOSE 6660 80

CMD [ "pnpm", "start:prod" ]
