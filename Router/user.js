const express = require("express");
const bodyParser = require("body-parser");
const crypto = require('crypto');
const router = express.Router();
const Pusher = require('pusher');
const Token = require("../Model/model");

router.use(bodyParser.json());
router.use(express.json());

const pusher = new Pusher({
  appId: '1788589',
  key: 'f9d50dc5fcf1106227ce',
  secret: '8356f54260e9de57f040',
  cluster: 'ap2',
  useTLS: true
});

router.get('/generateQR', async (req, res) => {
  const tokenValue = crypto.randomBytes(64).toString('hex');
  const channelData = new Date().getDate() + "-" + new Date().getMonth() + "-" + new Date().getMinutes();
  const channelDataHash = crypto.createHash('md5').update(channelData + "||" + tokenValue).digest("hex");

  try {
    // Save the generated QR data to the database
    const token = new Token({
      channel: channelDataHash
    });
    await token.save();

    return res.status(200).json({
      success: true,
      msg: "QR DATA Created and saved to database",
      data: {
        channel: channelDataHash
      }
    });
  } catch (err) {
    console.error("Error saving token:", err);
    return res.status(500).json({
      success: false,
      msg: "Error saving token to database"
    });
  }
});

router.post('/triggerEvent', async (req, res) => {
  const { channel, user_id } = req.body;

  // Generate a token
  const token = crypto.randomBytes(64).toString('hex');

  try {
    // Save the token data to the database or use it as needed in your application logic
    const newToken = new Token({
      channel,
      token,
      user_id
    });
    await newToken.save();

    // Trigger the Pusher event
    const resp = await pusher.trigger(channel, "login-event", {
      token,
      user_id
    });

    return res.status(200).json({
      success: true,
      msg: "Event triggered successfully and token generated",
      data: {
        token,
        resp
      }
    });
  } catch (e) {
    console.error("Error triggering event:", e);
    return res.status(500).json({
      success: false,
      msg: "Error triggering event or generating token",
      error: e.message
    });
  }
});

module.exports = router;
