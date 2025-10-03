// const fs = require('fs');
// const path = require('path');
// const dotenv = require('dotenv');

// // Determine the environment
// const env = process.env.NODE_ENV || 'development';
// const envFile = env === 'production' ? '.env.production' : '.env';

// // Path to the root .env file
// const envPath = path.resolve(__dirname, '..', envFile);

// // Check if the file exists
// if (fs.existsSync(envPath)) {
//   // Load the environment variables
//   const result = dotenv.config({ path: envPath });
  
//   if (result.error) {
//     throw result.error;
//   }
  
//   console.log(`Loaded environment variables from ${envPath}`);
// } else {
//   console.warn(`Environment file not found: ${envPath}`);
// }

// // Export the loaded environment variables
// module.exports = process.env;




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
    
    // Determine which environment variables to include
    let reactEnvContent = '';
    for (const key in process.env) {
      if (key.startsWith('REACT_APP_') || 
          (appName === 'admin-dashboard' && key.startsWith('ADMIN_APP_'))) {
        reactEnvContent += `${key}=${process.env[key]}\n`;
      }
    }
    
    // Write the React .env file
    fs.writeFileSync(reactEnvPath, reactEnvContent);
    console.log(`Created React environment file at ${reactEnvPath}`);
  }
} else {
  console.warn(`Environment file not found: ${envPath}`);
}

// Export the loaded environment variables
module.exports = process.env;