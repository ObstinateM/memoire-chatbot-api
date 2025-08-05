# Use Node.js 22 Alpine for smaller image size
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "run", "start"] 