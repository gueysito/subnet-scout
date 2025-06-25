import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Anthropic } from "@anthropic-ai/sdk";

// Load .env variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Init Claude client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Claude endpoint — properly uses input
app.post("/ping", async (req, res) => {
  try {
    const userInput = req.body.input?.trim();

    if (!userInput) {
      return res.status(400).json({ error: "No input provided" });
    }

    const response = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 100,
      messages: [{ role: "user", content: userInput }],
    });

    const reply = response.content?.[0]?.text || "No response";
    res.json({ reply });
  } catch (err) {
    console.error("Claude error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🔧 Claude server is live at http://localhost:${PORT}`);
});