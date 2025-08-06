
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = require("./src/app"); 

const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://storied-mousse-1f080b.netlify.app',
    process.env.FRONTEND_URL
  ].filter(Boolean), // Remove undefined values
  credentials: true,
}));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
} = process.env;

app.get('/api/google-auth', (req, res) => {
  const scope = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ].join(' ');

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${GOOGLE_CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&` +
  `response_type=code&` +
  `scope=${encodeURIComponent(scope)}&` +
  `access_type=offline&prompt=consent`;
  res.redirect(authUrl);
});

// OAuth callback endpoint
app.get('/api/google-auth/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code');

  try {
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const accessToken = tokenResponse.data.access_token;

    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(
      `${frontendUrl}/oauth-success?name=${encodeURIComponent(userInfoResponse.data.name)}&email=${encodeURIComponent(userInfoResponse.data.email)}`
    );
  } catch (error) {
    console.error('Google OAuth error:', error.response?.data || error.message);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/oauth-error`);
  }
});

// Start your server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});
