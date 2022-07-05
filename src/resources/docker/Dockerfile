FROM node:12-alpine

RUN mkdir -p /app && \
    chown node:node /app -R && \
    apk add --no-cache git

USER node

WORKDIR /app

ENV LOG_LEVEL=info \
    NODE_ENV=production \
    PORT=3000

COPY --chown=node:node package.json package-lock.json /app/

# when NODE_ENV is set to production, it will not install devDependencies
RUN rm -Rf node_modules/
RUN npm install --production=false

COPY --chown=node:node . /app

RUN npm run build

CMD ["npm", "start"]