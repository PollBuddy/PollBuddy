FROM node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY bin ./bin
COPY public ./public
COPY routes ./routes
COPY app.js ./
COPY modules ./modules
COPY .env ./

EXPOSE 3000

CMD node bin/www
