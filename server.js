import express, { json } from 'express';
import fetch from 'node-fetch';
const app = express();

// Middleware to parse JSON body
app.use(json());

app.use(cors());

console.log("test")

// Route for AI text detection
app.post('/analyze', async (req, res) => {
  const apiKey = process.env.HUGGING_FACE_API_KEY;
  const apiUrl = 'https://api-inference.huggingface.co/models/roberta-base-openai-detector';
  const text = req.body.text;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
