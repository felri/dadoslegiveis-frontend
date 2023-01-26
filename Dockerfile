FROM node:18

WORKDIR /.

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 4173

RUN yarn build

CMD [ "yarn", "preview" ]
