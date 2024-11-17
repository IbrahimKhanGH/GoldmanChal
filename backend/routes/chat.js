const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const auth = require('../middleware/auth');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/', auth, async (req, res) => {
  try {
    const { messages, userContext } = req.body;

    // Create a system message with user's financial context
    const systemMessage = {
      role: 'system',
      content: `You are a helpful financial assistant. Here is the user's current financial information:
        - Current Balance: $${userContext.balance}
        - Recent Transactions: ${JSON.stringify(userContext.recentTransactions)}
        - Saving Goal: $${userContext.savingGoal}
        - Progress towards goal: $${userContext.currentProgress}
        
        Provide personalized financial advice based on this information. Be concise and specific.
        If they're close to their saving goal, encourage them.
        If they have recent large expenses, suggest budgeting tips.`
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 200
    });

    res.json({ message: response.choices[0].message });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ message: 'Error processing chat request' });
  }
});

module.exports = router; 