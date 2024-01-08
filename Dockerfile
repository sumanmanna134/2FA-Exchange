FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install --no-package-lock --verbose

# Bundle app source
COPY . .


EXPOSE 3000

CMD [ "npm", "run" , "start:dev" ]