/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
import axios from 'axios';
import { config } from 'dotenv';
import express, { json, type Express, type Request, type Response } from 'express';

config();

const app: Express = express();
const port = process.env.PORT || 3005;

// Middleware to parse JSON bodies
app.use(json());

app.post('/ai', async (req: Request, res: Response) => {
  const { prompt, model, schema } = req.body;

  if (!prompt || !model || !schema) {
    return res.status(400).json({ error: "Prompt, model, and schema are required" });
  }

  try {
    // Forward the request to OpenAI
    const openAIResponse = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        model,
        messages: [
          { role: 'system', content: `Use the following schema: ${JSON.stringify(schema)}. Populate the data object from the user's input.` },
          { role: 'user', content: prompt }
        ],
        functions: [
          {
            name: "generate_data",
            description: "Generate a data object based on the provided schema",
            parameters: schema
          }
        ],
        stream: true
      },
      responseType: 'stream'
    });

    // Forward the response headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Pipe the OpenAI response directly to our response
    openAIResponse.data.pipe(res);

    // Handle the end of the stream
    openAIResponse.data.on('end', () => {
      res.write("data: [DONE]\n\n");
      res.end();
    });

  } catch (error) {
    console.error("Error proxying request to OpenAI:", error);
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error?.message || "Failed to process request";
      res.status(statusCode).json({ error: errorMessage });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export { app, port };
