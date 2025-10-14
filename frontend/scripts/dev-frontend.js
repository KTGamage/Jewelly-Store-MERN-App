const { execSync } = require('child_process');

// Set environment variables for frontend
process.env.PORT = '3000';
process.env.REACT_APP_API_URL = 'http://localhost:5000';

// Start the React app
execSync('react-scripts start', { stdio: 'inherit' });