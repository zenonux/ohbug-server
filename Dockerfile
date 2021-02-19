FROM keymetrics/pm2:latest-alpine
LABEL maintainer="chenyueban <jasonchan0527@gmail.com>"
USER root
RUN apk add --no-cache git
RUN apk add --no-cache openssh

WORKDIR /usr/src/ohbug

# ohbug-server
COPY package.json /usr/src/ohbug/package.json
COPY yarn.lock /usr/src/ohbug/yarn.lock
COPY packages/common/package.json /usr/src/ohbug/packages/common/package.json
COPY packages/dashboard/package.json /usr/src/ohbug/packages/dashboard/package.json
COPY packages/manager/package.json /usr/src/ohbug/packages/manager/package.json
COPY packages/notifier/package.json /usr/src/ohbug/packages/notifier/package.json
COPY packages/transfer/package.json /usr/src/ohbug/packages/transfer/package.json
COPY lerna.json /usr/src/ohbug/lerna.json
RUN yarn
COPY ./ /usr/src/ohbug
RUN yarn bootstrap
RUN yarn build

RUN git clone https://github.com/ohbug-org/ohbug-web-app.git /usr/src/ohbug-web-app
RUN cd /usr/src/ohbug-web-app && yarn && yarn build
COPY /usr/src/ohbug-web-app/dist/ /usr/src/ohbug/packages/dashboard/app

EXPOSE 6660 6666 80 443

CMD [ "yarn", "start:prod" ]
