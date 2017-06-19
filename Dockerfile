FROM node:6

# Remove default fonts
RUN rm -rf /usr/share/fonts/truetype/dejavu/

# Update font cache
COPY fonts /root/.fonts
RUN fc-cache -fv

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y libgtk2.0-0 libgconf-2-4 \
    libasound2 libxtst6 libxss1 libnss3 xvfb

# Install app dependencies
COPY . /usr/src/app
RUN npm install

EXPOSE 3000
#CMD [ "npm", "run" , "pm2" ]
ENTRYPOINT ["./entrypoint.sh"]
CMD [ "npm", "start" ]