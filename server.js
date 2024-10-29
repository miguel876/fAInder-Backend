import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

const app = express();

dotenv.config();

// Middleware to parse JSON body
app.use(json());
app.use(cors());

const errorMsg = "We are not being able to read the page. Please, try again!";

// Route for AI text detection
app.post('/analyze', async (req, res) => {
  const apiKey = process.env.HUGGING_FACE_API_KEY;
  const apiUrl = 'https://api-inference.huggingface.co/models/roberta-base-openai-detector';

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'The page does not have any text to analyze!' });
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text
      }),
    });

    if (!response.ok) {
      throw new Error(errorMsg);
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: errorMsg });
  }
});
