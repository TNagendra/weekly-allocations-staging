import React from 'react';
import '../styles/AuthButton.css'; // Import the styles
// const API_URL = process.env.REACT_APP_API_URL;
export default function AuthButton() {
  const handleLogin = () => {
    // window.location.href = 'http://localhost:5000/api/google-auth';
    // window.location.href = `${API_URL}/api/google-auth`;
    window.location.href = 'https://weekly-allocations-production-2307.up.railway.app/api/google-auth';
  };

  return (
    <div className="auth-container">
      <button onClick={handleLogin} className="auth-button">
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google logo"
          className="google-logo"
        />
        Sign in with Google
      </button>
    </div>
  );
}
