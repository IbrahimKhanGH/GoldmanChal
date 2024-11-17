require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const multer = require('multer');
const vision = require('@google-cloud/vision');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const accountRoutes = require('./routes/accounts');
const transactionRoutes = require('./routes/transactions');
const chatRoutes = require('./routes/chat');
const depositRoutes = require('./routes/deposits');

const app = express();
app.use(cors());
app.use(express.json());

// Multer configuration for file uploads
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// MongoDB Connection with debug logging
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Database:', mongoose.connection.db.databaseName);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  });

// Log all MongoDB queries (remove in production)
mongoose.set('debug', true);

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', depositRoutes);

app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Initialize Vision client with credentials from env
let visionClient;
try {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
  visionClient = new vision.ImageAnnotatorClient({
    credentials,
  });
  console.log('Vision client initialized successfully');
} catch (error) {
  console.error('Error initializing Vision client:', error);
  process.exit(1);
}

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

// Plaid endpoints
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

// New endpoint for check scanning with confidence score
app.post('/api/scan-check', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const [result] = await visionClient.documentTextDetection({
      image: {
        content: req.file.buffer
      }
    });

    const fullTextAnnotation = result.fullTextAnnotation;
    
    if (!fullTextAnnotation) {
      return res.status(400).json({ error: 'No text detected in image' });
    }

    const detectedText = fullTextAnnotation.text.toLowerCase();
    console.log('Processing check with text:', detectedText);

    // Initialize scoring system
    let confidenceScore = 0;
    const scoringElements = {
      'pay to the order of': 20,
      'dollars': 15,
      'date': 15,
      'memo': 10,
      'bank': 15,
      'void after': 10,
      '$': 15
    };

    // Track found elements for debugging
    const foundElements = {};

    // Check for each scoring element
    Object.entries(scoringElements).forEach(([keyword, score]) => {
      if (detectedText.includes(keyword)) {
        confidenceScore += score;
        foundElements[keyword] = true;
      }
    });

    // Additional checks
    if (/\d{2}\/\d{2}\/\d{4}/.test(detectedText)) { // Date format
      confidenceScore += 10;
      foundElements['date_format'] = true;
    }

    if (/\$\s*\d+\.\d{2}/.test(detectedText)) { // Dollar amount format
      confidenceScore += 10;
      foundElements['amount_format'] = true;
    }

    // MICR line check (those special characters at bottom of check)
    if (detectedText.includes('⑈') || /\d{9}/.test(detectedText)) {
      confidenceScore += 20;
      foundElements['micr'] = true;
    }

    // Normalize score to 100
    confidenceScore = Math.min(100, confidenceScore);

    console.log('Check validation details:', {
      confidenceScore,
      foundElements,
      isValid: confidenceScore >= 50
    });

    // Log the confidence score for debugging
    console.log(`Check Confidence Score: ${confidenceScore}%`);

    res.json({
      text: fullTextAnnotation.text,
      confidenceScore,
      isValid: confidenceScore >= 50,
      details: {
        foundElements,
        rawText: detectedText,
        message: `Check Validation Score: ${confidenceScore}%${confidenceScore >= 50 ? ' ✓' : ' ✗'}`
      }
    });

  } catch (error) {
    console.error('Error processing check:', error);
    res.status(500).json({ error: 'Failed to process check image' });
  }
});

app.post('/api/verify', express.json(), (req, res) => {
  try {
    const { extractedText } = req.body;

    if (!extractedText) {
      return res.status(400).json({ error: 'No text provided for verification.' });
    }

    const lines = extractedText.split('\n').map(line => line.trim().toLowerCase());

    // Enhanced checks with more flexible patterns
    const hasPayee = lines.some(line => 
      line.startsWith('pay to the order of') || 
      line.startsWith('payee') ||
      line.startsWith('pay')
    );
    const hasAmount = lines.some(line => /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?/.test(line) || /\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*dollars/.test(line));
    const hasDate = lines.some(line => /\d{1,2}\/\d{1,2}\/\d{2,4}/.test(line));

    // Adjust the threshold: require at least 2 out of 3 fields
    const validFields = [hasPayee, hasAmount, hasDate].filter(Boolean).length;
    const isLegit = validFields >= 2; // Adjust threshold as needed

    res.json({ isLegit, details: { hasPayee, hasAmount, hasDate } });
  } catch (error) {
    console.error('Error during check verification:', error);
    res.status(500).json({ error: 'Internal server error during check verification.' });
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// MongoDB connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
