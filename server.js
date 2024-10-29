import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

const app = express();

dotenv.config();

app.use(json());
app.use(cors());

const errorMsg = "We are not being able to read the page. Please, try again!";

// Route for AI text detection
app.post('/analyze', async (req, res) => {
  const apiKey = process.env.HUGGING_FACE_API_KEY;
  const apiUrl = 'https://api-inference.huggingface.co/models/roberta-base-openai-detector';
  const inputs = req.body.text;

  if (!inputs) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: errorMsg });
  }
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
