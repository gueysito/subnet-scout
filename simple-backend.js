/**
 * Simple Backend API Server for Subnet Scout
 * Standalone Express server with embedded subnet metadata
 * Avoids complex imports that cause Railway deployment issues
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Add security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Embedded subnet metadata to avoid import issues
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
    github: "https://github.com/corcel-api/cortex.t",
    type: "inference"
  },
  8: { 
    name: "Taoshi", 
    description: "Financial prediction and quantitative analysis subnet",
    github: "https://github.com/taoshidev/time-series-prediction-subnet",
    type: "prediction"
  },
  9: { 
    name: "BitAPAI", 
    description: "API aggregation and data synthesis subnet",
    github: "https://github.com/BitAPAI/BitAPAI-subnet",
    type: "data"
  },
  10: { 
    name: "Map Reduce", 
    description: "Distributed computing and parallel processing subnet",
    github: "https://github.com/neuralinternet/compute-subnet",
    type: "compute"
  }
};

// Helper function to get subnet metadata with fallback
function getSubnetMetadata(subnetId) {
  const metadata = SUBNET_METADATA[subnetId];
  if (!metadata) {
    return {
      name: `Subnet ${subnetId}`,
      description: `Bittensor subnet ${subnetId} - real-time monitoring`,
      github: `https://github.com/bittensor-subnet/subnet-${subnetId}`,
      type: 'inference'
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'simple-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Main subnet agents endpoint
app.get('/api/agents', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
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
    
    res.json({
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
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agents data',
      timestamp: new Date().toISOString()
    });
  }
});

// Individual subnet data endpoint (using wildcard to avoid path-to-regexp issues)
app.get('/api/subnet/*/data', (req, res) => {
  try {
    // Extract ID manually from URL path
    const pathParts = req.path.split('/');
    const subnetId = parseInt(pathParts[3]); // /api/subnet/[ID]/data
    
    if (isNaN(subnetId) || subnetId < 1 || subnetId > 118) {
      return res.status(400).json({
        success: false,
        error: 'Invalid subnet ID. Must be between 1-118.',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`📊 Serving individual subnet data for subnet ${subnetId}`);
    
    const subnetData = generateSubnetData(subnetId);
    res.json(subnetData);
    
  } catch (error) {
    console.error(`Error in /api/subnet/*/data:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subnet data',
      timestamp: new Date().toISOString()
    });
  }
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
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

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple Backend API Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET /health - Health check`);
  console.log(`   GET /api/agents - Subnet agents list`);
  console.log(`   GET /api/subnet/:id/data - Individual subnet data`);
  console.log(`✅ Server ready to serve subnet data!`);
});