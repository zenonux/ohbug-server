FROM keymetrics/pm2:12-alpine
WORKDIR /usr/src/app
USER root

COPY package.json /usr/src/app/package.json
COPY yarn.lock /usr/src/app/yarn.lock
COPY packages/api/package.json /usr/src/app/packages/api/package.json
COPY lerna.json /usr/src/app/lerna.json
RUN yarn
RUN yarn bootstrap

COPY ./ /usr/src/app
RUN yarn build

EXPOSE 6666

# api server
CMD [ "pm2-runtime", "start" ,"./ecosystem.config.js" ]
