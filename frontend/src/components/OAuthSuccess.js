import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        handleOAuthCallback(token, userData);
        navigate('/');
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login?error=oauth_failed');
      }
    } else {
      navigate('/login?error=oauth_missing_data');
    }
  }, [searchParams, handleOAuthCallback, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;