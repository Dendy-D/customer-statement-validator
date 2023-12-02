FROM ubuntu:20.04

RUN apt-get update && apt-get install -y curl gnupg build-essential
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
ENV NVM_DIR="/root/.nvm"
RUN \. "$NVM_DIR/nvm.sh" && nvm install 18.16.1
RUN \. "$NVM_DIR/nvm.sh" && nvm alias default 18.16.1
ENV PATH="/root/.nvm/versions/node/v18.16.1/bin/:${PATH}"

RUN apt-get install -y python

RUN npm install -g yarn

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

CMD ["yarn", "dev"]

EXPOSE 5000
