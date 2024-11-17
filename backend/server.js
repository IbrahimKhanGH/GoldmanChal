require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const vision = require('@google-cloud/vision');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const app = express();
const upload = multer();

// Initialize Vision client with credentials from env
const visionClient = new vision.ImageAnnotatorClient({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS)
});

// Initialize Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

app.use(cors());
app.use(express.json());

// Existing Plaid endpoints
app.post('/api/create_link_token', async (req, res) => {
  try {
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user-' + Math.random() },
      client_name: 'Financial Inclusion App',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json(tokenResponse.data);
  } catch (error) {
    console.error('Error creating link token:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/exchange_public_token', async (req, res) => {
  try {
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });
    res.json(exchangeResponse.data);
  } catch (error) {
    console.error('Error exchanging public token:', error);
    res.status(500).json({ error: error.message });
  }
});

// New endpoint for check scanning
app.post('/api/scan-check', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Perform text detection with Google Cloud Vision
    const [result] = await visionClient.textDetection({
      image: {
        content: req.file.buffer
      }
    });

    const detections = result.textAnnotations;
    
    if (!detections || detections.length === 0) {
      return res.status(400).json({ error: 'No text detected in image' });
    }

    // Get all detected text
    const text = detections[0].description;
    console.log('Detected text:', text);

    // Send back the detected text
    res.json({ text });
  } catch (error) {
    console.error('Error processing check:', error);
    res.status(500).json({ error: 'Failed to process check image' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 