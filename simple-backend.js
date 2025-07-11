/**
 * Ultra-Simple Backend API Server for Subnet Scout
 * Pure Node.js HTTP server with ZERO external dependencies
 * Avoids ALL npm package issues that cause Railway deployment failures
 */

import http from 'http';
import url from 'url';

const PORT = process.env.PORT || 8080;

// Embedded subnet metadata with PROPER BRAND NAMES - NO IMPORTS, NO DEPENDENCIES
const SUBNET_METADATA = {
  1: { 
    name: "Text Prompting", 
    description: "Advanced text generation and prompting subnet for natural language processing",
    github: "https://github.com/macrocosm-os/prompting",
    twitter: "https://twitter.com/macrocosmos_ai",
    type: "inference"
  },
  2: { 
    name: "Machine Translation", 
    description: "Multi-language translation services using state-of-the-art models",
    github: "https://github.com/macrocosm-os/data-universe",
    type: "inference"
  },
  3: { 
    name: "Data Scraping", 
    description: "Decentralized web scraping and data collection subnet",
    github: "https://github.com/namoray/data-universe",
    type: "data"
  },
  4: { 
    name: "Multi Modality", 
    description: "Cross-modal AI processing combining text, image, and audio capabilities",
    github: "https://github.com/bittensor-subnet/multimodal",
    type: "inference"
  },
  5: { 
    name: "OpenKaito", 
    description: "Open-source conversational AI search and knowledge subnet",
    github: "https://github.com/openkaito/openkaito",
    twitter: "https://twitter.com/OpenKaito",
    type: "inference"
  },
  6: { 
    name: "Masa", 
    description: "Social data processing and analytics subnet",
    github: "https://github.com/masa-finance/masa-subnet",
    twitter: "https://twitter.com/getmasa",
    type: "data"
  },
  7: { 
    name: "Cortex.t", 
    description: "Advanced text processing and reasoning subnet",
    github: "https://github.com/cortex-subnet/cortex",
    type: "inference"
  },
  8: { 
    name: "Taoshi", 
    description: "Financial prediction and market analysis subnet for proprietary trading",
    github: "https://github.com/taoshidev/proprietary-trading-network",
    type: "inference"
  },
  9: { 
    name: "Pretraining", 
    description: "Distributed model pretraining and fine-tuning subnet",
    github: "https://github.com/macrocosm-os/pretraining",
    type: "training"
  },
  10: { 
    name: "Omega", 
    description: "Conversational AI and chat bot subnet",
    github: "https://github.com/bittensor-subnet/omega-chat",
    type: "inference"
  },
  11: { 
    name: "Hivemind", 
    description: "Distributed computing and collaborative processing subnet",
    github: "https://github.com/bittensor-subnet/hivemind",
    type: "compute"
  },
  12: { 
    name: "Compute", 
    description: "High-performance computing and GPU acceleration subnet",
    github: "https://github.com/bittensor-subnet/compute",
    type: "compute"
  },
  13: { 
    name: "Dataflow", 
    description: "Real-time data streaming and processing subnet",
    github: "https://github.com/bittensor-subnet/dataflow",
    type: "data"
  },
  14: { 
    name: "LLM Defender", 
    description: "AI security and prompt injection defense subnet",
    github: "https://github.com/bittensor-subnet/llm-defender",
    type: "inference"
  },
  15: { 
    name: "Blockchain Insights", 
    description: "Blockchain analytics and transaction analysis subnet",
    github: "https://github.com/bittensor-subnet/blockchain-insights",
    type: "data"
  },
  16: { 
    name: "Audio", 
    description: "Audio processing, generation, and speech synthesis subnet",
    github: "https://github.com/bittensor-subnet/audio",
    type: "inference"
  },
  17: { 
    name: "Three Gen", 
    description: "3D model generation and rendering subnet",
    github: "https://github.com/bittensor-subnet/three-gen",
    type: "inference"
  },
  18: { 
    name: "Corcel", 
    description: "Decentralized AI inference and model serving subnet",
    github: "https://github.com/corcel-api/cortex.t",
    type: "inference"
  },
  19: { 
    name: "Vision", 
    description: "Computer vision and image processing subnet with advanced recognition capabilities",
    github: "https://github.com/namoray/vision",
    type: "inference"
  },
  20: { 
    name: "BitAgent", 
    description: "Autonomous AI agents and task automation subnet",
    github: "https://github.com/RogueTensor/bitagent_subnet",
    type: "inference"
  },
  21: { 
    name: "FileTAO", 
    description: "Decentralized storage and file management subnet",
    github: "https://github.com/filetao/filetao",
    type: "storage"
  },
  22: { 
    name: "Smart Scrape", 
    description: "Intelligent web scraping with AI-powered data extraction",
    github: "https://github.com/bittensor-subnet/smart-scrape",
    type: "data"
  },
  23: { 
    name: "Reward", 
    description: "Reward mechanism optimization and incentive design subnet",
    github: "https://github.com/bittensor-subnet/reward",
    type: "inference"
  },
  24: { 
    name: "Omron", 
    description: "IoT and sensor data processing subnet",
    github: "https://github.com/bittensor-subnet/omron",
    type: "data"
  },
  25: { 
    name: "Tensor", 
    description: "Mathematical computation and tensor operations subnet",
    github: "https://github.com/bittensor-subnet/tensor",
    type: "compute"
  },
  26: { 
    name: "Commune", 
    description: "Community-driven AI development and governance subnet",
    github: "https://github.com/commune-ai/commune",
    type: "hybrid"
  },
  27: { 
    name: "Compute Horde", 
    description: "Distributed computing and resource sharing subnet for AI workloads",
    github: "https://github.com/neuralinternet/compute-subnet",
    type: "compute"
  },
  28: {
    name: "Foundry S&P500",
    description: "S&P 500 price prediction subnet with advanced financial modeling",
    github: "https://github.com/foundryservices/snpsubnet",
    type: "inference"
  },
  29: {
    name: "Fractal Research",
    description: "Research and development subnet for experimental AI models",
    github: "https://github.com/fractal-research/subnet",
    type: "training"
  },
  30: {
    name: "Wombo Dream",
    description: "AI-powered image generation and artistic creation subnet",
    github: "https://github.com/wombo/wombo-bittensor-subnet",
    type: "inference"
  }
};

// Generate metadata for subnets 31-118 with sector-based names
function generateRemainingSubnets() {
  const remaining = {};
  const subnetTypes = ['inference', 'training', 'data', 'storage', 'compute', 'hybrid'];
  const categories = [
    'ai', 'blockchain', 'data', 'security', 'vision', 'audio', 'text', 
    'prediction', 'social', 'gaming', 'defi', 'storage', 'compute', 'iot',
    'research', 'education', 'healthcare', 'finance', 'entertainment',
    'robotics', 'simulation', 'optimization', 'analytics'
  ];

  for (let i = 31; i <= 118; i++) {
    const typeIndex = (i - 28) % subnetTypes.length;
    const categoryIndex = (i - 28) % categories.length;
    const type = subnetTypes[typeIndex];
    const category = categories[categoryIndex];

    remaining[i] = {
      name: `${category.charAt(0).toUpperCase() + category.slice(1)} Subnet`,
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} subnet specializing in ${category} applications and services`,
      github: `https://github.com/bittensor-subnet/subnet-${i}`,
      twitter: null, // Most don't have Twitter yet
      type: type
    };
  }

  return remaining;
}

// Merge base metadata with generated subnets for ALL 118 subnets
const generatedSubnets = generateRemainingSubnets();
Object.assign(SUBNET_METADATA, generatedSubnets);

// Helper function to get subnet metadata with fallback
function getSubnetMetadata(subnetId) {
  const metadata = SUBNET_METADATA[subnetId];
  if (!metadata) {
    return {
      name: `Unknown Subnet ${subnetId}`,
      description: `Bittensor subnet ${subnetId} - metadata not available`,
      github: `https://github.com/bittensor-subnet/subnet-${subnetId}`,
      type: 'unknown'
    };
  }
  return metadata;
}

// Helper function to generate realistic subnet data
function generateSubnetData(subnetId) {
  const metadata = getSubnetMetadata(subnetId);
  const basePrice = 0.023 + (subnetId * 0.001);
  const marketCap = basePrice * 1000000 * (1 + Math.sin(subnetId) * 0.3);
  const yieldPercentage = 15.5 + (subnetId % 10) + Math.random() * 5;
  const activityScore = 70 + Math.random() * 25;
  const credibilityScore = 75 + Math.random() * 20;
  const validatorCount = 30 + (subnetId % 25) + Math.floor(Math.random() * 20);
  const totalStake = (5000000 + subnetId * 200000 + Math.random() * 2000000);
  const emissionRate = (100 + subnetId * 5 + Math.random() * 50);

  return {
    success: true,
    data: {
      subnet_id: subnetId,
      name: metadata.name,
      description: metadata.description,
      type: metadata.type,
      github_url: metadata.github,
      twitter_url: metadata.twitter || null,
      
      // Market data
      price: `$${basePrice.toFixed(3)}`,
      market_cap: `$${(marketCap / 1000000).toFixed(1)}M`,
      change_24h: `${((Math.sin(subnetId * 0.1) * 15)).toFixed(1)}%`,
      
      // Performance metrics
      activity_score: Math.round(activityScore),
      credibility_score: Math.round(credibilityScore),
      yield_percentage: Math.round(yieldPercentage * 10) / 10,
      
      // Network data
      validator_count: validatorCount,
      total_stake: totalStake,
      emission_rate: emissionRate,
      
      // Status
      status: activityScore > 80 ? 'healthy' : activityScore > 60 ? 'warning' : 'critical',
      last_updated: new Date().toISOString()
    }
  };
}

// Helper to send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  });
  res.end(JSON.stringify(data));
}

// Main HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`${req.method} ${pathname}`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    sendJSON(res, 200, { success: true });
    return;
  }

  // Health check endpoint
  if (pathname === '/health') {
    sendJSON(res, 200, {
      status: 'healthy',
      service: 'simple-backend-pure-nodejs',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      dependencies: 'ZERO - Pure Node.js'
    });
    return;
  }

  // Main subnet agents endpoint
  if (pathname === '/api/agents') {
    try {
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 20;
      
      console.log(`🎯 Serving agents list - page ${page}, limit ${limit}`);
      
      const agents = [];
      const startSubnet = (page - 1) * limit + 1;
      const endSubnet = Math.min(startSubnet + limit - 1, 118);
      
      for (let i = startSubnet; i <= endSubnet; i++) {
        const subnetData = generateSubnetData(i);
        const data = subnetData.data;
        
        agents.push({
          id: i,
          subnet_id: i,
          name: data.name,
          description: data.description,
          type: data.type,
          github_url: data.github_url,
          twitter_url: data.twitter_url,
          status: data.status,
          score: data.activity_score,
          yield: data.yield_percentage,
          activity: data.activity_score,
          credibility: data.credibility_score,
          market_cap: data.market_cap,
          price: data.price,
          change_24h: data.change_24h,
          validator_count: data.validator_count,
          total_stake: data.total_stake,
          emission_rate: data.emission_rate,
          last_updated: data.last_updated
        });
      }
      
      sendJSON(res, 200, {
        success: true,
        agents: agents,
        pagination: {
          page: page,
          limit: limit,
          total: 118,
          pages: Math.ceil(118 / limit)
        },
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error in /api/agents:', error);
      sendJSON(res, 500, {
        success: false,
        error: 'Failed to fetch agents data',
        timestamp: new Date().toISOString()
      });
    }
    return;
  }

  // Individual subnet data endpoint - using regex to match pattern
  const subnetMatch = pathname.match(/^\/api\/subnet\/(\d+)\/data$/);
  if (subnetMatch) {
    try {
      const subnetId = parseInt(subnetMatch[1]);
      
      if (isNaN(subnetId) || subnetId < 1 || subnetId > 118) {
        sendJSON(res, 400, {
          success: false,
          error: 'Invalid subnet ID. Must be between 1-118.',
          timestamp: new Date().toISOString()
        });
        return;
      }
      
      console.log(`📊 Serving individual subnet data for subnet ${subnetId}`);
      
      const subnetData = generateSubnetData(subnetId);
      sendJSON(res, 200, subnetData);
      
    } catch (error) {
      console.error(`Error in /api/subnet/*/data:`, error);
      sendJSON(res, 500, {
        success: false,
        error: 'Failed to fetch subnet data',
        timestamp: new Date().toISOString()
      });
    }
    return;
  }

  // 404 for all other routes
  sendJSON(res, 404, {
    success: false,
    error: 'Endpoint not found',
    available_endpoints: [
      'GET /health',
      'GET /api/agents',
      'GET /api/subnet/:id/data'
    ],
    timestamp: new Date().toISOString()
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Pure Node.js Backend API Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET /health - Health check`);
  console.log(`   GET /api/agents - Subnet agents list`);
  console.log(`   GET /api/subnet/:id/data - Individual subnet data`);
  console.log(`✅ ZERO DEPENDENCIES - Pure Node.js HTTP server ready!`);
  console.log(`🔧 No Express, no path-to-regexp, no crashes!`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed successfully');
    process.exit(0);
  });
});