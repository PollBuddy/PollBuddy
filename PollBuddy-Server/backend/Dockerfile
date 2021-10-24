# Production Dockerfile

FROM node:current-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Only install production dependencies
RUN npm ci --only=production

# Bundle app source
# Folders
COPY bin ./bin
COPY modules ./modules
COPY public ./public
COPY routes ./routes
# Files
COPY app.js ./
# copy both the example file and any existing custom .env 
COPY .env* ./
# attempt to move the example .env to the name ".env"
# if .env is already there, this fails and the custom instance is used
# if not, the example instance is used
RUN ["mv","-n", ".env.example", ".env"]

# Port
EXPOSE 3000

# Start command
CMD ["node", "bin/www"]
