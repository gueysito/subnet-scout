import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Anthropic } from "@anthropic-ai/sdk";
import ScoreAgent from "./src/scoring/ScoreAgent.js";

// Load .env variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Init Claude client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Init ScoreAgent
const scoreAgent = new ScoreAgent(process.env.ANTHROPIC_API_KEY);

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

// Scoring endpoint - Calculate subnet scores using ScoreAgent
app.post("/api/score", async (req, res) => {
  try {
    const { subnet_id, metrics, timeframe = '24h' } = req.body;

    // Validate required fields
    if (!subnet_id || !metrics) {
      return res.status(400).json({ 
        error: {
          code: "INVALID_REQUEST",
          message: "Missing required fields: subnet_id and metrics",
          timestamp: new Date().toISOString()
        }
      });
    }

    // Calculate score using ScoreAgent
    const scoreResult = await scoreAgent.calculateScore(subnet_id, metrics, timeframe);
    
    console.log(`✅ Calculated score for subnet ${subnet_id}: ${scoreResult.overall_score}/100`);
    res.json(scoreResult);

  } catch (err) {
    console.error("Scoring error:", err.message);
    res.status(500).json({ 
      error: {
        code: "SCORING_ERROR",
        message: err.message,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Batch scoring endpoint - Calculate scores for multiple subnets
app.post("/api/score/batch", async (req, res) => {
  try {
    const { subnet_metrics, timeframe = '24h' } = req.body;

    if (!subnet_metrics || typeof subnet_metrics !== 'object') {
      return res.status(400).json({ 
        error: {
          code: "INVALID_REQUEST",
          message: "Missing required field: subnet_metrics (object)",
          timestamp: new Date().toISOString()
        }
      });
    }

    // Calculate batch scores
    const batchResult = await scoreAgent.calculateBatchScores(subnet_metrics, timeframe);
    
    console.log(`✅ Calculated batch scores for ${batchResult.results.length} subnets`);
    res.json(batchResult);

  } catch (err) {
    console.error("Batch scoring error:", err.message);
    res.status(500).json({ 
      error: {
        code: "BATCH_SCORING_ERROR",
        message: err.message,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    scoring_engine: "active"
  });
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🔧 Subnet Scout Backend is live at http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST /ping - Claude AI chat`);
  console.log(`   POST /api/score - Subnet scoring`);
  console.log(`   POST /api/score/batch - Batch scoring`);
  console.log(`   GET  /health - Health check`);
  console.log(`🧠 ScoreAgent initialized with Claude integration`);
});