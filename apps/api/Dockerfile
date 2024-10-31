# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

COPY package.json ./

# Remove workspace dependencies before installing
RUN sed -i 's/"@repo\/.*": "workspace:\*",//g' package.json

COPY pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3005

# Define the command to run the application
CMD ["pnpm", "start"]