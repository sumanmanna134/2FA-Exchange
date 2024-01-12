# Use an official Node.js runtime as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install NestJS dependencies
RUN yarn install --frozen-lockfile --check-files

# Copy the rest of the application code to the container
COPY . .

# Display the content of package.json to help with troubleshooting
RUN cat package.json

# Display the content of yarn.lock to help with troubleshooting
RUN cat yarn.lock

# Display the list of files in the current directory to help with troubleshooting
RUN ls -al

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your application
CMD ["yarn", "start:dev"]
