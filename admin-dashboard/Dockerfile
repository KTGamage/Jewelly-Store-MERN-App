FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set environment variable for API URL
ENV REACT_APP_API_URL=http://localhost:5000

RUN npm run build

# If using serve for production
RUN npm install -g serve
EXPOSE 3001
CMD ["serve", "-s", "build", "-l", "3001"]

# Or if using the React dev server in development:
# EXPOSE 3000
# CMD ["npm", "start"]