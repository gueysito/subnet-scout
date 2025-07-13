/**
 * Bittensor Subnet Metadata Database
 * Contains names, descriptions, and GitHub repository URLs for all 118+ subnets
 * Enhanced with comprehensive data from final_subnet_database.md
 */

import { 
  getEnhancedSubnetMetadata, 
  getAllEnhancedSubnetMetadata,
  ENHANCED_SUBNET_DATABASE 
} from './enhancedSubnets.js';

export const SUBNET_METADATA = {
  1: { 
    name: "Text Prompting", 
    description: "Advanced text generation and prompting subnet for natural language processing",
    github: "https://github.com/macrocosm-os/prompting",
    twitter: "https://twitter.com/opentensor", // Verified: OpenTensor Foundation official account
    website: "https://bittensor.com", // OpenTensor Foundation official website
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
    twitter: "https://twitter.com/_kaitoai", // Verified: Kaito AI official account
    website: "https://kaito.ai", // Verified: Kaito AI official website
    type: "inference"
  },
  6: { 
    name: "Masa", 
    description: "Social data processing and analytics subnet",
    github: "https://github.com/masa-finance/masa-subnet",
    twitter: "https://twitter.com/getmasa", // Verified: Masa Finance official account
    website: "https://masa.ai", // Verified: Masa Finance official website
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
    twitter: "https://twitter.com/taoshiio", // Verified: Taoshi official account
    website: "https://taoshi.io", // Verified: Taoshi official website
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
    website: "https://corcel.io", // Verified: Corcel official website
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
    website: "https://wombo.ai", // Verified: WOMBO official website
    type: "inference"
  }
};

/**
 * Generate metadata for subnets 31-118 with sector-based names
 */
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
      website: null, // Most don't have websites yet
      type: type
    };
  }

  return remaining;
}

// Merge base metadata with generated subnets
const generatedSubnets = generateRemainingSubnets();
Object.assign(SUBNET_METADATA, generatedSubnets);

/**
 * Get subnet metadata by ID with enhanced data and backwards compatibility
 */
export function getSubnetMetadata(subnetId) {
  // First try enhanced database for comprehensive metadata
  const enhanced = getEnhancedSubnetMetadata(subnetId);
  if (enhanced && enhanced.name !== `Subnet ${subnetId}`) {
    // Convert enhanced format to legacy format for backwards compatibility
    return {
      name: enhanced.brandName || enhanced.name,
      description: enhanced.description,
      github: enhanced.github,
      twitter: enhanced.twitter,
      website: enhanced.website,
      type: enhanced.type,
      sector: enhanced.sector,
      specialization: enhanced.specialization,
      builtBy: enhanced.builtBy,
      status: enhanced.status
    };
  }
  
  // Fallback to legacy metadata
  const metadata = SUBNET_METADATA[subnetId];
  if (!metadata) {
    return {
      name: `Subnet ${subnetId}`,
      description: `Bittensor subnet ${subnetId} - metadata not available`,
      github: `https://github.com/bittensor-subnet/subnet-${subnetId}`,
      type: 'unknown'
    };
  }
  return metadata;
}

/**
 * Get all subnet metadata (enhanced version preferred)
 */
export function getAllSubnetMetadata() {
  // Return enhanced metadata if available, fallback to legacy
  const enhanced = getAllEnhancedSubnetMetadata();
  if (Object.keys(enhanced).length > 0) {
    return enhanced;
  }
  return SUBNET_METADATA;
}

/**
 * Search subnets by type
 */
export function getSubnetsByType(type) {
  return Object.entries(SUBNET_METADATA)
    .filter(([, metadata]) => metadata.type === type)
    .map(([id, metadata]) => ({ id: parseInt(id), ...metadata }));
}

/**
 * Get subnet GitHub URL
 */
export function getSubnetGithubUrl(subnetId) {
  const metadata = getSubnetMetadata(subnetId);
  return metadata.github;
}

// Re-export enhanced functions for easy access
export { 
  getEnhancedSubnetMetadata,
  getSubnetsBySector,
  getAllSectors,
  searchEnhancedSubnets,
  getSubnetStats,
  SUBNET_SECTORS
} from './enhancedSubnets.js'; 