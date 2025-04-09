# Use the latest LTS version of Node.js
FROM node:23-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN yarn

# Copy the rest of your application files
COPY . .

EXPOSE 3000

# Build the React app
CMD [ "yarn", "start" ]