FROM node:6

# Remove default fonts
RUN rm -rf /usr/share/fonts/truetype/dejavu/

# Update font cache
COPY fonts /root/.fonts
RUN fc-cache -fv

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app
RUN npm install

EXPOSE 3000
CMD [ "npm", "run" , "pm2" ]
