# Use Node.js official lightweight image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the application listens on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
