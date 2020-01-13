FROM node:10.18-buster

RUN npm install -g nodemon

WORKDIR /app
RUN mkdir -p node_modules
COPY ./package.json .
# COPY ./script.sh .
RUN chown -R node:node /app
USER node
# RUN npm install


COPY --chown=node:node . .

EXPOSE 3000

# CMD [ "nodemon", "/app/server/index.js" ]
CMD [ "npm", "run", "docker" ]


