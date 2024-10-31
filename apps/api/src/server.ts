/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
import axios, { AxiosError } from "axios";
import { config } from "dotenv";
import express, {
  json,
  type Express,
  type Request,
  type Response
} from "express";

config();

const app: Express = express();
const port = process.env.PORT || 3005;

// Middleware to parse JSON bodies
app.use(json());

app.use((_: Request, res: Response, next) => {
  if (!process.env.OPENAI_API_KEY) {
    console.error("⚠️ OpenAI API key is not set in environment variables");
    return res.status(500).json({
      error: "API key configuration error",
      message: "The server is not properly configured with an API key"
    });
  }
  next();
});

interface OpenAIError {
  error?: {
    message: string;
    type?: string;
    param?: string;
    code?: string;
  };
}

app.post("/ai", async (req: Request, res: Response) => {
  const { prompt, model, schema } = req.body;

  if (!prompt || !model || !schema) {
    console.error("❌ Invalid request:", {
      prompt: Boolean(prompt),
      model: Boolean(model),
      schema: Boolean(schema)
    });
    return res.status(400).json({
      error: "Invalid request",
      message: "Prompt, model, and schema are required",
      missing: Object.entries({ prompt, model, schema })
        .filter(([_, value]) => !value)
        .map(([key]) => key)
    });
  }

  console.log("📡 Sending request to OpenAI:", {
    model,
    promptLength: prompt.length,
    schemaProperties: Object.keys(schema.properties || {})
  });

  try {
    // Forward the request to OpenAI
    const openAIResponse = await axios({
      method: "post",
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      data: {
        model,
        messages: [
          {
            role: "system",
            content: `Use the following schema: ${JSON.stringify(schema)}. Populate the data object from the user's input.`
          },
          { role: "user", content: prompt }
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
      responseType: "stream"
    });

    console.log("✅ OpenAI connection established");

    // Forward the response headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    let hasEnded = false;

    const endResponse = () => {
      if (!hasEnded) {
        hasEnded = true;
        try {
          res.write("data: [DONE]\n\n");
          res.end();
        } catch (err) {
          console.error("Error ending response:", err);
        }
      }
    };

    // Handle stream end
    openAIResponse.data.on("end", () => {
      console.log("✅ Stream completed successfully");
      endResponse();
    });

    // Handle stream errors
    openAIResponse.data.on("error", (err: Error) => {
      console.error("❌ Stream error:", err);
      endResponse();
    });

    // Handle client disconnect
    req.on("close", () => {
      if (!hasEnded) {
        console.log("🔌 Client disconnected");
        hasEnded = true;
        res.end();
      }
    });

    // Pipe the OpenAI response to our response
    openAIResponse.data.pipe(res);
  } catch (error) {
    const axiosError = error as AxiosError<OpenAIError>;
    console.error("❌ Error proxying request to OpenAI:", {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      error: axiosError.response?.data,
      config: {
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        headers: {
          ...axiosError.config?.headers,
          Authorization: axiosError.config?.headers?.Authorization
            ? "[REDACTED]"
            : undefined
        }
      }
    });

    const errorResponse = {
      error: "OpenAI API Error",
      status: axiosError.response?.status,
      message: axiosError.response?.data.error?.message || axiosError.message,
      type: axiosError.response?.data.error?.type,
      code: axiosError.response?.data.error?.code,
      debug:
        process.env.NODE_ENV === "development"
          ? {
              apiKeyPresent: Boolean(process.env.OPENAI_API_KEY),
              apiKeyLength: process.env.OPENAI_API_KEY?.length,
              requestedModel: model
            }
          : undefined
    };

    res.status(axiosError.response?.status || 500).json(errorResponse);
  }
});

export { app, port };
