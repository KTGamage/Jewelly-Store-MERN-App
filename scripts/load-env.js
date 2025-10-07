const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Determine the environment
const env = process.env.NODE_ENV || 'development';
const envFile = env === 'production' ? '.env.production' : '.env';

// Path to the root .env file
const envPath = path.resolve(__dirname, '..', envFile);

// Check if the file exists
if (fs.existsSync(envPath)) {
  // Load the environment variables
  const result = dotenv.config({ path: envPath });
  
  if (result.error) {
    throw result.error;
  }
  
  console.log(`Loaded environment variables from ${envPath}`);
  
  // If this script was called from a React app, create the appropriate .env file
  if (process.argv[2] === 'react') {
    const appName = process.argv[3] || 'frontend';
    const appPath = path.resolve(__dirname, '..', appName);
    const reactEnvPath = path.join(appPath, '.env');
    
    // Set different ports for different apps
    let port = '3000'; // Default for frontend
    if (appName === 'admin-dashboard') {
      port = '3001'; // Admin dashboard port
    }
    
    // Start with PORT setting
    let reactEnvContent = `PORT=${port}\n`;
    
    // Determine which environment variables to include
    for (const key in process.env) {
      if (key.startsWith('REACT_APP_') || 
          (appName === 'admin-dashboard' && key.startsWith('ADMIN_APP_'))) {
        reactEnvContent += `${key}=${process.env[key]}\n`;
      }
    }
    
    // Write the React .env file
    fs.writeFileSync(reactEnvPath, reactEnvContent);
    console.log(`Created React environment file at ${reactEnvPath} with PORT=${port}`);
  }
} else {
  console.warn(`Environment file not found: ${envPath}`);
}

// Export the loaded environment variables
module.exports = process.env;