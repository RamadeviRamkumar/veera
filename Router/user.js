const express = require('express');
const qrCode = require('qrcode');
const bodyParser = require('body-parser');
const router = express.Router();
const Token = require ('../Model/model')
// app.use(bodyParser.json());


const generateToken = () => {
    return Math.random().toString(36).substring(2, 10);
  };
  
  const tokens = {};
  
  router.get("/auth/token", async (req, res) => {
    try {
      const token = generateToken();
  
      // Save token to database
      await Token.create({ token, isAuthenticated: false });
  
      const qrImage = await qrCode.toDataURL(token);
  
      res.json({ token, qrImage });
    } catch (error) {
      console.error("Error generating QR code:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  router.post("/auth/verify", async (req, res) => {
    try {
      const { token } = req.body;
  
      // Find token in database
      const foundToken = await Token.findOne({ token });
  
      if (foundToken) {
        // Update token status in database
        foundToken.isAuthenticated = true;
        await foundToken.save();
        
        res.json({ isAuthenticated: true });
      } else {
        res.status(400).json({ isAuthenticated: false, error: "Invalid token" });
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  module.exports = router;
