# This dockerfile is considered "production ready" so we're compiling and building the app rather than running it in
# dev mode. This grants us a few optimizations desirable in a production environment.

# Build Stage 1 - Used to transpile and minimize
FROM node:16 AS builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Instead of npm install, we're using npm ci which uses package-lock.json instead of package.json for more reproducible
# builds and for performance. We also won't be needing dev dependencies here so those are omitted.
# Note: --legacy-peer-deps has been added due to a conflict with React versions
RUN npm ci --only=production --legacy-peer-deps

# Bundle app source
# Folders
COPY public ./public
COPY src ./src
# Files
# copy both the example file and any existing custom .env 
COPY .env* ./
# attempt to move the example .env to the name ".env"
# if .env is already there, this fails and the custom instance is used
# if not, the example instance is used
RUN ["mv","-n", ".env.example", ".env"]

# Build command
RUN npm run build



# Build Stage 2 - Run previously built files
FROM nginx:stable-alpine-perl

# Install curl
RUN apk add --no-cache curl

# Bundle the NGINX config files
COPY webproxy/nginx.conf /etc/nginx/
COPY webproxy/conf.d /etc/nginx/conf.d

# Create app directory
WORKDIR /usr/src/app

# Bundle app source from builder
COPY --from=builder /usr/src/app/build ./build

# Port
EXPOSE 80

# Health Check
HEALTHCHECK --interval=15s --timeout=3s CMD curl -f http://localhost || exit 1