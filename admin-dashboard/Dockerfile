# Development stage
FROM node:18-alpine as development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Set environment variable for API URL
ENV REACT_APP_API_URL=http://localhost:5000

EXPOSE 3000

# Use React dev server for development
CMD ["npm", "start"]

# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV REACT_APP_API_URL=http://localhost:5000

RUN npm run build

# Production stage
FROM node:18-alpine as production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Copy built application from build stage
COPY --from=build /app/build ./build

RUN npm install -g serve
EXPOSE 3001
CMD ["serve", "-s", "build", "-l", "3001"]