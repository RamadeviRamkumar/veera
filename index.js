const express = require('express');
const qrCode = require('qrcode');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Generate a unique token for each authentication request
const generateToken = () => {
  return Math.random().toString(36).substring(2, 10);
};

// Store tokens temporarily (not recommended for production, use a database instead)
const tokens = {};

// Endpoint to request QR code authentication
app.get('/auth/token', async (req, res) => {
  try {
    // Generate a unique token
    const token = generateToken();

    // Store the token
    tokens[token] = false;

    // Generate QR code for the token
    const qrImage = await qrCode.toDataURL(token);

    res.json({ token, qrImage });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to verify the scanned token
app.post('/auth/verify', (req, res) => {
  try {
    const { token } = req.body;

    // Check if the token exists and is valid
    if (tokens[token] !== undefined) {
      // Mark the token as authenticated
      tokens[token] = true;
      res.json({ isAuthenticated: true });
    } else {
      res.status(400).json({ isAuthenticated: false, error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
