FROM keymetrics/pm2:12-alpine
WORKDIR /usr/src/app
USER root

COPY package.json /usr/src/app/package.json
COPY yarn.lock /usr/src/app/yarn.lock
COPY packages/dashboard/package.json /usr/src/app/packages/dashboard/package.json
COPY packages/common/package.json /usr/src/app/packages/common/package.json
COPY packages/transfer/package.json /usr/src/app/packages/transfer/package.json
COPY lerna.json /usr/src/app/lerna.json
RUN yarn

COPY ./ /usr/src/app
RUN yarn bootstrap
RUN yarn build

EXPOSE 6660
EXPOSE 6666

# dashboard server
CMD [ "pm2-runtime", "start" ,"./ecosystem.config.js" ]
