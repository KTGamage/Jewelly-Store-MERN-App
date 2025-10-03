import React from 'react';
import { Button } from 'react-bootstrap';

function GoogleLogin() {
  const handleGoogleLogin = () => {
    // Implement Google OAuth login
    window.location.href = '/api/auth/google';
  };

  return (
    <Button 
      variant="outline-primary" 
      className="w-100 mt-3"
      onClick={handleGoogleLogin}
    >
      Sign in with Google
    </Button>
  );
}

export default GoogleLogin;