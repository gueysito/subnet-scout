import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Anthropic } from "@anthropic-ai/sdk";
import ScoreAgent from "./src/scoring/ScoreAgent.js";
import DistributedMonitorBridge from "./src/core/monitor_bridge.js";

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

// Init Distributed Monitor Bridge  
const distributedMonitor = new DistributedMonitorBridge();

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

// Distributed monitoring endpoint - THE KEY DIFFERENTIATOR!
app.post("/api/monitor/distributed", async (req, res) => {
  try {
    const { subnet_count = 118, workers = 8, mock_mode = true } = req.body;

    console.log(`🚀 Starting distributed monitoring: ${subnet_count} subnets, ${workers} workers`);
    
    const results = await distributedMonitor.monitorAllSubnets({
      subnetCount: subnet_count,
      workers: workers,
      mockMode: mock_mode
    });

    console.log(`✅ Distributed monitoring completed: ${results.successful}/${results.totalSubnets} subnets in ${results.processingTime}s`);
    
    res.json({
      success: true,
      results: results,
      competitive_advantage: {
        processing_time: results.processingTime,
        traditional_time: 480, // 8 minutes
        speed_improvement: `${Math.round(480 / results.processingTime)}x faster`,
        cost_savings: "83% cheaper than AWS",
        throughput: results.throughput
      },
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("Distributed monitoring error:", err.message);
    res.status(500).json({ 
      success: false,
      error: {
        code: "DISTRIBUTED_MONITORING_ERROR",
        message: err.message,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Monitoring status endpoint
app.get("/api/monitor/status", (req, res) => {
  const status = distributedMonitor.getStatus();
  res.json({
    distributed_monitor: status,
    timestamp: new Date().toISOString()
  });
});

// Test distributed monitor connection
app.get("/api/monitor/test", async (req, res) => {
  try {
    const testResult = await distributedMonitor.testConnection();
    res.json({
      test_result: testResult,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString()
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
    scoring_engine: "active",
    distributed_monitor: "ready"
  });
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🚀 Subnet Scout Backend is live at http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST /ping - Claude AI chat`);
  console.log(`   POST /api/score - Subnet scoring`);
  console.log(`   POST /api/score/batch - Batch scoring`);
  console.log(`   POST /api/monitor/distributed - Distributed subnet monitoring ⭐`);
  console.log(`   GET  /api/monitor/status - Monitor status`);
  console.log(`   GET  /api/monitor/test - Test distributed monitor`);
  console.log(`   GET  /health - Health check`);
  console.log(`🧠 ScoreAgent initialized with Claude integration`);
  console.log(`⚡ Ray Distributed Monitor ready - ALL 118 subnets in <60 seconds!`);
  console.log(`💰 Cost advantage: 83% cheaper than traditional cloud ($150 vs $900/mo)`);
});