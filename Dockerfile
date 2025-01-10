# Use the official Node.js 18 image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code into the container
COPY . .

# Build the Next.js application for production
RUN npm run build

# Expose the port that the Next.js app will run on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
