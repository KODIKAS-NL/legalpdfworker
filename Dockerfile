FROM node:10

RUN apt-get update
RUN apt-get install -y libgtk2.0-0 libgconf-2-4 \
    libasound2 libxtst6 libxss1 libnss3 xvfb

# Remove default fonts
RUN rm -rf /usr/share/fonts/truetype/dejavu/

# Update font cache
COPY fonts /root/.fonts
RUN fc-cache -fv

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm config set unsafe-perm true

# Install app dependencies
COPY . /usr/src/app
RUN npm install

RUN npm i pm2 -g

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["pm2-runtime", "server.js"]
