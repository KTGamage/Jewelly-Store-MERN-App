# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create .env file with required variables
RUN echo "PORT=3000" > .env
RUN echo "REACT_APP_API_URL=http://localhost:5000" >> .env

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from build stage
COPY --from=build /app/build ./build

# Install serve to run the application
RUN npm install -g serve


EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]