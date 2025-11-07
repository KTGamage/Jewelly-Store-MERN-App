const fs = require('fs');
const path = require('path');

// This script sets up environment variables for CI/CD
const envVars = {
  // Backend environment variables
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/jewellery_test',
  JWT_SECRET: process.env.JWT_SECRET || 'test_jwt_secret',
  NODE_ENV: 'test',
  
  // Frontend environment variables
  REACT_APP_API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  
  // Admin environment variables
  ADMIN_APP_API_URL: process.env.ADMIN_APP_API_URL || 'http://localhost:5000'
};

// Create .env files for each application
const apps = ['frontend', 'admin-dashboard'];

apps.forEach(app => {
  const envPath = path.join(__dirname, '..', app, '.env');
  let envContent = '';
  
  Object.keys(envVars).forEach(key => {
    if (key.startsWith('REACT_APP_') || 
        (app === 'admin-dashboard' && key.startsWith('ADMIN_APP_')) ||
        (app === 'backend' && !key.startsWith('REACT_APP_') && !key.startsWith('ADMIN_APP_'))) {
      envContent += `${key}=${envVars[key]}\n`;
    }
  });
  
  fs.writeFileSync(envPath, envContent);
  console.log(`Created ${app} environment file`);
});

console.log('Environment setup completed for CI/CD');