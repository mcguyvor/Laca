FROM node:18

WORKDIR /app

COPY package.json /app/package.json

RUN yarn

COPY . .

EXPOSE 3000

ENTRYPOINT ["yarn", "dev"]
