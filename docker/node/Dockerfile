FROM node:10.18-buster

RUN npm install -g nodemon

WORKDIR /app
RUN mkdir -p node_modules
RUN chown -R node:node /app
COPY ./package.json .
USER node
RUN npm install

RUN ls -la

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "nodemon", "/app/server/index.js" ]


