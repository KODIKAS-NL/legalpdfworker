FROM node:6

RUN apt-get update
RUN apt-get install -y gsfonts-x11

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app
RUN npm install

EXPOSE 3000
CMD [ "npm", "run" , "pm2" ]
