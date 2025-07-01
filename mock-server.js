import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mock data generators
const generateMockAgent = (id) => ({
  id: `agent_${id}`,
  status: ['active', 'idle', 'busy'][Math.floor(Math.random() * 3)],
  gpu_type: ['RTX4090', 'A100', 'H100'][Math.floor(Math.random() * 3)],
  location: ['us-west-1', 'us-east-1', 'eu-west-1'][Math.floor(Math.random() * 3)],
  price_per_hour: Math.round((Math.random() * 0.5 + 0.1) * 100) / 100,
  capabilities: ['inference', 'training'],
  last_ping: new Date().toISOString()
});

const generateMockSubnetData = (netuid) => ({
  netuid,
  block_number: 5816712 + Math.floor(Math.random() * 1000),
  timestamp: new Date().toISOString(),
  price: (Math.random() * 0.01 + 0.02).toFixed(3),
  emission_rate: Math.round((Math.random() * 500 + 1000) * 10) / 10,
  total_stake: Math.round((Math.random() * 50000 + 100000) * 100) / 100,
  validator_count: Math.floor(Math.random() * 200 + 50),
  activity_score: Math.round((Math.random() * 40 + 60) * 10) / 10
});

const generateMockScore = (subnetId) => {
  const yieldScore = Math.floor(Math.random() * 30 + 70);
  const activityScore = Math.floor(Math.random() * 30 + 70);
  const credibilityScore = Math.floor(Math.random() * 30 + 70);
  const overallScore = Math.floor((yieldScore + activityScore + credibilityScore) / 3);
  
  return {
    subnet_id: subnetId,
    overall_score: overallScore,
    breakdown: {
      yield_score: yieldScore,
      activity_score: activityScore,
      credibility_score: credibilityScore
    },
    metrics: {
      current_yield: Math.round((Math.random() * 10 + 5) * 10) / 10,
      yield_change_24h: Math.round((Math.random() * 2 - 1) * 10) / 10,
      activity_level: overallScore > 80 ? 'high' : overallScore > 60 ? 'medium' : 'low',
      risk_level: overallScore > 80 ? 'low' : overallScore > 60 ? 'medium' : 'high'
    },
    ai_summary: `Subnet ${subnetId} shows ${overallScore > 80 ? 'strong' : overallScore > 60 ? 'moderate' : 'concerning'} performance with current yield trends indicating ${Math.random() > 0.5 ? 'positive' : 'stable'} momentum.`,
    timestamp: new Date().toISOString()
  };
};

// 1. Mock io.net API
app.get('/api/ionet/agents', (req, res) => {
  const agents = Array.from({ length: 20 }, (_, i) => generateMockAgent(i + 1));
  const totalCount = 327000;
  const availableCount = Math.floor(totalCount * 0.75);
  
  res.json({
    agents,
    total_count: totalCount,
    available_count: availableCount
  });
});

// 2. Mock TaoStats API
app.get('/api/taostats/pool/history', (req, res) => {
  const { netuid = 1, page = 1, limit = 10 } = req.query;
  
  // Simulate auth check
  const auth = req.headers.authorization;
  if (!auth || !auth.includes(':')) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid authentication credentials',
        timestamp: new Date().toISOString()
      }
    });
  }
  
  const data = Array.from({ length: parseInt(limit) }, () => 
    generateMockSubnetData(parseInt(netuid))
  );
  
  res.json(data);
});

// 3. Mock Telegram Webhook
app.post('/webhook/telegram', (req, res) => {
  const { message } = req.body;
  
  if (!message || !message.text) {
    return res.status(400).json({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Missing message text',
        timestamp: new Date().toISOString()
      }
    });
  }
  
  // Parse command
  const text = message.text.toLowerCase();
  let response = "I didn't understand that command. Try `/score subnet 1`";
  
  if (text.includes('/score subnet')) {
    const subnetMatch = text.match(/subnet (\d+)/);
    if (subnetMatch) {
      const subnetId = parseInt(subnetMatch[1]);
      const score = generateMockScore(subnetId);
      response = `🔍 Subnet ${subnetId} Analysis:\n\n📊 Score: ${score.overall_score}/100\n💰 Yield: ${score.metrics.current_yield}%\n⚡ Activity: ${score.breakdown.activity_score}/100\n🛡️ Credibility: ${score.breakdown.credibility_score}/100\n\n${score.ai_summary}`;
    }
  } else if (text.includes('/help')) {
    response = "Available commands:\n/score subnet [id] - Get subnet analysis\n/help - Show this help";
  }
  
  res.json({
    method: 'sendMessage',
    chat_id: message.chat.id,
    text: response,
    parse_mode: 'HTML'
  });
});

// 4. Mock Internal Scoring API
app.post('/api/score', (req, res) => {
  const { subnet_id, metrics, timeframe = '24h' } = req.body;
  
  if (!subnet_id || !metrics) {
    return res.status(400).json({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Missing required fields: subnet_id and metrics',
        timestamp: new Date().toISOString()
      }
    });
  }
  
  // Simulate processing delay
  setTimeout(() => {
    const score = generateMockScore(subnet_id);
    res.json(score);
  }, Math.random() * 500 + 200); // 200-700ms delay
});

app.get('/api/agents', (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const startIndex = (page - 1) * limit;
  
  const agents = Array.from({ length: parseInt(limit) }, (_, i) => {
    const subnetId = startIndex + i + 1;
    const score = generateMockScore(subnetId);
    
    return {
      subnet_id: subnetId,
      name: `Subnet ${subnetId}`,
      status: score.overall_score > 70 ? 'healthy' : score.overall_score > 50 ? 'warning' : 'critical',
      score: score.overall_score,
      yield: score.metrics.current_yield,
      activity: score.breakdown.activity_score,
      credibility: score.breakdown.credibility_score,
      last_updated: new Date().toISOString()
    };
  });
  
  const totalCount = 118;
  const healthyCount = Math.floor(totalCount * 0.8);
  const averageScore = Math.round(agents.reduce((sum, agent) => sum + agent.score, 0) / agents.length);
  
  res.json({
    agents,
    total_count: totalCount,
    healthy_count: healthyCount,
    average_score: averageScore,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total_pages: Math.ceil(totalCount / limit)
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Mock server error:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Endpoint ${req.method} ${req.path} not found`,
      timestamp: new Date().toISOString()
    }
  });
});

const PORT = process.env.MOCK_SERVER_PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔧 Mock Server running at http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /api/ionet/agents - Mock io.net agents`);
  console.log(`   GET  /api/taostats/pool/history - Mock TaoStats data`);
  console.log(`   POST /webhook/telegram - Mock Telegram webhook`);
  console.log(`   POST /api/score - Mock scoring endpoint`);
  console.log(`   GET  /api/agents - Mock agents list`);
  console.log(`   GET  /health - Health check`);
});

export default app; 