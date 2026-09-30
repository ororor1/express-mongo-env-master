# Use official Node.js LTS image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy app source code
COPY . .

# Expose application port
EXPOSE 8080

# Use production environment by default
ENV NODE_ENV=production


# Start the app
CMD ["sh", "-c", "npm run prod"]
