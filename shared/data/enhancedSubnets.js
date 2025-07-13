/**
 * Enhanced Bittensor Subnet Database
 * Comprehensive metadata for all 118+ subnets including brand names, social links, sectors, and specializations
 * Source: final_subnet_database.md (July 12, 2025) + existing project data
 */

export const ENHANCED_SUBNET_DATABASE = {
  0: {
    name: "Root Network",
    brandName: "Root Network",
    description: "DECOMMISSIONED - Central decision-making center (February 2025 - Dynamic TAO Upgrade)",
    sector: "Network Infrastructure",
    specialization: "Network governance and TAO emission distribution (Historical)",
    github: null,
    twitter: null,
    website: null,
    builtBy: "Opentensor Foundation",
    status: "decommissioned",
    type: "infrastructure"
  },
  1: {
    name: "Apex",
    brandName: "Apex (Macrocosmos)",
    description: "Premier text generation subnet - competitive marketplace for LLM inference",
    sector: "Text Generation",
    specialization: "Large Language Model inference, text completions, conversational responses",
    github: "https://github.com/macrocosm-os/prompting",
    twitter: "https://twitter.com/MacrocosmosAI",
    website: "https://www.macrocosmos.ai/sn1",
    builtBy: "Macrocosmos",
    status: "active",
    type: "inference"
  },
  2: {
    name: "Omron",
    brandName: "Omron (Inference Labs)",
    description: "Decentralized inference and compute verification using zero-knowledge proofs",
    sector: "Zero-Knowledge ML",
    specialization: "Zero-knowledge AI proofs, cryptographically secure verification without revealing data",
    github: "https://github.com/inference-labs-inc/omron-subnet",
    twitter: "https://twitter.com/omron_ai",
    website: "https://omron.ai/",
    builtBy: "Inference Labs",
    status: "active",
    type: "verification"
  },
  3: {
    name: "Templar",
    brandName: "Templar (Datura AI)",
    description: "Specialized code generation subnet for high-quality software development",
    sector: "Code Generation",
    specialization: "Code generation, debugging, optimization across multiple programming languages",
    github: "https://github.com/Datura-ai/templar",
    twitter: "https://twitter.com/datura_ai",
    website: "https://datura.ai/",
    builtBy: "Datura AI",
    status: "active",
    type: "inference"
  },
  4: {
    name: "Targon",
    brandName: "Targon (Namoray)",
    description: "Multi-modal subnet specializing in vision-language model capabilities",
    sector: "Multi-Modality",
    specialization: "Vision-language models processing visual and textual information simultaneously",
    github: "https://github.com/namoray/vision",
    twitter: null,
    website: null,
    builtBy: "Namoray",
    status: "active",
    type: "inference"
  },
  5: {
    name: "OpenKaito",
    brandName: "OpenKaito",
    description: "Decentralized web search and AI-powered search capabilities",
    sector: "Web Search",
    specialization: "Search indexing, query processing, result ranking across the internet",
    github: "https://github.com/OpenKaito/openkaito",
    twitter: "https://twitter.com/openkaitohq",
    website: "https://openkaito.xyz/",
    builtBy: "OpenKaito Team",
    status: "active",
    type: "inference"
  },
  6: {
    name: "NousResearch Fine-tuning",
    brandName: "NousResearch",
    description: "First-ever continuous fine-tuning benchmark for Large Language Models",
    sector: "AI Training",
    specialization: "Continuous fine-tuning with synthetic data generation, dynamic model improvement",
    github: "https://github.com/NousResearch/finetuning-subnet",
    twitter: "https://twitter.com/NousResearch",
    website: "https://nousresearch.com/",
    builtBy: "Nous Research",
    status: "active",
    type: "training"
  },
  7: {
    name: "SubVortex",
    brandName: "SubVortex",
    description: "Decentralized network of subtensor nodes enhancing Bittensor infrastructure",
    sector: "Infrastructure",
    specialization: "Subtensor nodes, network decentralization, blockchain infrastructure",
    github: "https://github.com/eclipsevortex/SubVortex",
    twitter: "https://twitter.com/SubVortexTao",
    website: "https://www.subvortex.com/",
    builtBy: "Eclipse Vortex Team",
    status: "active",
    type: "infrastructure"
  },
  8: {
    name: "Taoshi",
    brandName: "Taoshi",
    description: "Financial prediction subnet for time series forecasting and market analysis",
    sector: "Financial AI",
    specialization: "Time series forecasting, market analysis, trading insights, economic indicators",
    github: "https://github.com/taoshidev/time-series-prediction-subnet",
    twitter: "https://twitter.com/taoshiio",
    website: "https://taoshi.io/",
    builtBy: "Taoshi",
    status: "active",
    type: "inference"
  },
  9: {
    name: "IOTA Pretraining",
    brandName: "IOTA (Macrocosmos)",
    description: "Premier pretraining subnet rewarding Foundation-Model development",
    sector: "AI Training",
    specialization: "Pretrained Foundation-Models on Falcon Refined Web dataset, frontier-scale model pretraining",
    github: "https://github.com/macrocosm-os/pretraining",
    twitter: "https://twitter.com/MacrocosmosAI",
    website: "https://iota.macrocosmos.ai/",
    builtBy: "Macrocosmos",
    status: "active",
    type: "training"
  },
  10: {
    name: "Sturdy",
    brandName: "Sturdy Finance",
    description: "Decentralized yield optimization engine for DeFi lending markets",
    sector: "DeFi",
    specialization: "AI-powered allocation strategies, autonomous yield optimizers, liquidity providers",
    github: "https://github.com/Sturdy-Subnet/sturdy-subnet",
    twitter: "https://twitter.com/SturdyFinance",
    website: "https://sturdy.finance/",
    builtBy: "Sturdy Finance",
    status: "active",
    type: "hybrid"
  },
  11: {
    name: "Dippy",
    brandName: "Dippy AI",
    description: "Conversational AI subnet focused on personality-driven chatbots and roleplay",
    sector: "Conversational AI",
    specialization: "Character personalities, creative roleplay scenarios, entertaining conversations",
    github: "https://github.com/dippyai/dippy-bittensor-subnet",
    twitter: "https://twitter.com/dippydotai",
    website: "https://dippy.ai/",
    builtBy: "Dippy AI",
    status: "active",
    type: "inference"
  },
  12: {
    name: "Compute Horde",
    brandName: "Compute Horde",
    description: "Distributed computing subnet providing scalable computational resources",
    sector: "Distributed Computing",
    specialization: "Computing power contribution, task distribution, computational job execution",
    github: "https://github.com/backend-developers-ltd/ComputeHorde",
    twitter: "https://twitter.com/computehorde",
    website: "https://computehorde.io/",
    builtBy: "Backend Developers Ltd",
    status: "active",
    type: "compute"
  },
  13: {
    name: "Data Universe",
    brandName: "Data Universe (Macrocosmos)",
    description: "Decentralized data layer collecting 350M+ rows daily for subnet use",
    sector: "Data Collection",
    specialization: "Data collection, storage, distribution from wide range of sources, 1.8B+ rows dataset",
    github: "https://github.com/macrocosm-os/data-universe",
    twitter: "https://twitter.com/MacrocosmosAI",
    website: "https://www.macrocosmos.ai/sn13",
    builtBy: "Macrocosmos",
    status: "active",
    type: "data"
  },
  14: {
    name: "TAO Hash",
    brandName: "TAO Hash",
    description: "Leading subnet for decentralizing proof-of-work mining hashrate",
    sector: "Mining",
    specialization: "PoW mining hashrate decentralization, rental, exchange, Bitcoin mining power marketplace",
    github: "https://github.com/latent-to/taohash",
    twitter: "https://twitter.com/TAOHash",
    website: "https://taohash.ai/",
    builtBy: "Latent Holdings",
    status: "active",
    type: "mining"
  },
  15: {
    name: "de_val",
    brandName: "de_val AI",
    description: "Decentralized evaluation subnet for Large Language Models",
    sector: "AI Evaluation",
    specialization: "LLM evaluation, A/B testing, continuous monitoring, reference-free metrics",
    github: "https://github.com/deval-core/De-Val",
    twitter: "https://twitter.com/de_valAI",
    website: "https://www.de-val.ai/",
    builtBy: "de_val Core Team",
    status: "active",
    type: "evaluation"
  },
  16: {
    name: "HashTensor",
    brandName: "HashTensor (formerly BitAds)",
    description: "Decentralized subnet tracking mining activity across PoW blockchains",
    sector: "Mining",
    specialization: "Multi-blockchain mining validation, Kaspa hashrate redirection, on-chain value creation",
    github: "https://github.com/HashTensor/HashTensor_Subnet",
    twitter: "https://twitter.com/hashtensor",
    website: "https://hashtensor.com/",
    builtBy: "HashTensor Team",
    status: "active",
    type: "mining"
  },
  17: {
    name: "404-GEN (Three Gen)",
    brandName: "404-GEN",
    description: "Revolutionary 3D asset creation through simple text descriptions",
    sector: "3D Asset Generation",
    specialization: "3D content creation, immersive worlds, AR/VR/XR experiences, game development",
    github: "https://github.com/404-Repo/three-gen-subnet",
    twitter: "https://twitter.com/404gen_",
    website: "https://404.xyz/",
    builtBy: "404-GEN Team",
    status: "active",
    type: "inference"
  },
  18: {
    name: "Zeus",
    brandName: "Zeus (formerly Cortex.t)",
    description: "Pioneering decentralized climate forecasting using advanced AI models",
    sector: "Climate Forecasting",
    specialization: "Environmental variables, temperature, precipitation, climate data, weather prediction",
    github: "https://github.com/Orpheus-AI/Zeus",
    twitter: "https://twitter.com/zeussubnet",
    website: "https://www.zeussubnet.com/",
    builtBy: "Ørpheus AI & BitMind",
    status: "active",
    type: "inference"
  },
  19: {
    name: "Nineteen",
    brandName: "Nineteen (Rayon Labs)",
    description: "High-performance decentralized inference with lightning-fast AI models",
    sector: "AI Inference",
    specialization: "Text and image generation, state-of-the-art generative AI, industry-leading speeds",
    github: "https://github.com/rayonlabs/nineteen",
    twitter: "https://twitter.com/rayon_labs",
    website: "https://nineteen.ai/",
    builtBy: "Rayon Labs",
    status: "active",
    type: "inference"
  },
  20: {
    name: "BitAgent",
    brandName: "BitAgent (RogueTensor)",
    description: "Competitive AI agent subnet for personalized assistance and automation",
    sector: "AI Agents",
    specialization: "Agentic tool usage, function calling, task automation, application integration",
    github: "https://github.com/RogueTensor/bitagent_subnet",
    twitter: "https://twitter.com/FrankRizz07",
    website: null,
    builtBy: "RogueTensor/Rizzo Network",
    status: "active",
    type: "inference"
  },
  21: {
    name: "OMEGA Any-to-Any",
    brandName: "OMEGA Labs (formerly FileTAO)",
    description: "World's largest decentralized multimodal dataset for AGI development",
    sector: "Multimodal AI",
    specialization: "Multimodal datasets, text/video/audio/image modalities, AGI research acceleration",
    github: "https://github.com/omegalabsinc/omegalabs-anytoany-bittensor",
    twitter: "https://twitter.com/omegalabsai",
    website: "https://www.omega.inc/",
    builtBy: "OMEGA Labs Inc.",
    status: "active",
    type: "data"
  },
  22: {
    name: "Desearch",
    brandName: "Desearch AI",
    description: "First decentralized, real-time AI search engine with hallucination-free results",
    sector: "AI Search",
    specialization: "Multi-source data analysis, Twitter/Reddit/ArXiv/YouTube search, hallucination elimination",
    github: "https://github.com/Desearch-ai/subnet-22",
    twitter: "https://twitter.com/desearch_ai",
    website: "https://desearch.ai/",
    builtBy: "Desearch.ai",
    status: "active",
    type: "inference"
  },
  23: {
    name: "Nuance",
    brandName: "Nuance (Zuvu)",
    description: "Incentive layer for global discourse optimization",
    sector: "Social Intelligence",
    specialization: "Factual content incentivization, discourse optimization, truth scaling, signal over noise",
    github: null,
    twitter: "https://twitter.com/ZuvuAI",
    website: null,
    builtBy: "Zuvu (SocialTensor merger)",
    status: "active",
    type: "social"
  },
  24: {
    name: "OMEGA Multimodal Dataset",
    brandName: "OMEGA Labs",
    description: "Data generation engine powering OMEGA's Any-to-Any models",
    sector: "Dataset Creation",
    specialization: "Multimodal data collection, video/audio/text/images, comprehensive training datasets",
    github: "https://github.com/omegalabsinc/omegalabs-bittensor-subnet",
    twitter: "https://twitter.com/omegalabsai",
    website: "https://omega-labs.ai/",
    builtBy: "OMEGA Labs Inc.",
    status: "active",
    type: "data"
  },
  25: {
    name: "Mainframe",
    brandName: "Mainframe (Macrocosmos)",
    description: "First decentralized science subnet specializing in protein folding",
    sector: "Decentralized Science",
    specialization: "Protein folding, GROMACS, OpenMM, molecular dynamics, scientific compute",
    github: "https://github.com/macrocosm-os/mainframe",
    twitter: "https://twitter.com/MacrocosmosAI",
    website: "https://www.macrocosmos.ai/sn25",
    builtBy: "Macrocosmos AI",
    status: "active",
    type: "compute"
  },
  26: {
    name: "Storb",
    brandName: "Storb Tech",
    description: "Decentralized object storage with fault-tolerant data solutions",
    sector: "Decentralized Storage",
    specialization: "Object storage, low latency, high success rates, proof of data possession",
    github: null,
    twitter: null,
    website: null,
    builtBy: "Storb Developers",
    status: "active",
    type: "storage"
  },
  27: {
    name: "NI Compute",
    brandName: "Neural Internet",
    description: "Advanced decentralized GPU compute marketplace",
    sector: "Decentralized Compute",
    specialization: "GPU resources, platform-composable cloud services, AI training and inference",
    github: "https://github.com/neuralinternet/compute-subnet",
    twitter: "https://twitter.com/neural_internet",
    website: "https://neuralinternet.ai/",
    builtBy: "Neural Internet",
    status: "active",
    type: "compute"
  },
  28: {
    name: "S&P 500 Oracle",
    brandName: "Foundry Services (DCG)",
    description: "Sophisticated financial forecasting subnet for S&P 500 predictions",
    sector: "Financial AI",
    specialization: "S&P 500 price predictions, short-term forecasting, equity market intelligence",
    github: "https://github.com/foundryservices/snpOracle",
    twitter: "https://twitter.com/FoundryServices",
    website: null,
    builtBy: "Foundry Services (DCG)",
    status: "active",
    type: "inference"
  },
  29: {
    name: "Coldint",
    brandName: "Coldint",
    description: "Collaborative distributed training for niche AI models",
    sector: "AI Training",
    specialization: "Distributed training, niche AI models, collaborative research, pre-training",
    github: "https://github.com/coldint",
    twitter: null,
    website: "https://coldint.io/",
    builtBy: "Coldint Team (Netherlands)",
    status: "active",
    type: "training"
  },
  30: {
    name: "Bettensor",
    brandName: "Bettensor (Nickel5)",
    description: "Revolutionary sports prediction subnet with competitive forecasting",
    sector: "Sports AI",
    specialization: "Sports prediction, multiple leagues, forecasting algorithms, sports analytics",
    github: "https://github.com/Nickel5-Inc/bettensor",
    twitter: "https://twitter.com/bettensor",
    website: "https://www.bettensor.com/",
    builtBy: "Nickel5 Inc",
    status: "active",
    type: "inference"
  },
  31: {
    name: "Candles",
    brandName: "Candles (formerly NASChain)",
    description: "Decentralized prediction protocol for crypto market sentiment",
    sector: "Financial AI",
    specialization: "Crypto market sentiment, wisdom of crowds, prediction pools, sentiment indices",
    github: null,
    twitter: "https://twitter.com/candlestao",
    website: null,
    builtBy: "Candles Team",
    status: "active",
    type: "inference"
  },
  32: {
    name: "It's AI",
    brandName: "It's AI",
    description: "Most accurate AI detection platform according to RAID benchmark",
    sector: "AI Detection",
    specialization: "AI content detection, text pattern analysis, LLM identification, authenticity protection",
    github: "https://github.com/It-s-AI/llm-detection",
    twitter: "https://twitter.com/ai_detection",
    website: "https://its-ai.org/",
    builtBy: "It's AI Team",
    status: "active",
    type: "evaluation"
  },
  33: {
    name: "ReadyAI",
    brandName: "ReadyAI (formerly AfterParty AI)",
    description: "Revolutionary data structuring at 660x lower cost than traditional services",
    sector: "Data Processing",
    specialization: "Unstructured data transformation, AI-ready datasets, conversational data processing",
    github: "https://github.com/afterpartyai/bittensor-conversation-genome-project",
    twitter: "https://twitter.com/ReadyAI_",
    website: "https://readyai.ai/",
    builtBy: "ReadyAI Team",
    status: "active",
    type: "data"
  },
  34: {
    name: "BitMind",
    brandName: "BitMind AI",
    description: "World's first decentralized deepfake detection system",
    sector: "AI Detection",
    specialization: "Deepfake detection, synthetic media identification, multi-platform content verification",
    github: "https://github.com/BitMind-AI/bitmind-subnet",
    twitter: "https://twitter.com/BitMindAI",
    website: "https://bitmind.ai/",
    builtBy: "BitMind AI Team",
    status: "active",
    type: "evaluation"
  },
  35: {
    name: "LogicNet",
    brandName: "LogicNet (formerly AIT Protocol)",
    description: "Decentralized AI subnet for mathematical reasoning and logic",
    sector: "Mathematical Reasoning",
    specialization: "Mathematical problems, logical reasoning, computational logic, fine-tuning competition",
    github: "https://github.com/LogicNet-Subnet/LogicNet",
    twitter: null,
    website: "https://logicnet.streamlit.app/",
    builtBy: "LogicNet Team",
    status: "active",
    type: "inference"
  },
  36: {
    name: "Web Agents",
    brandName: "Autoppia (formerly HIP Labs)",
    description: "Autonomous web automation using Infinite Web Arena benchmark",
    sector: "Autonomous Web Agents",
    specialization: "Web automation, synthetic web benchmarks, autonomous web operation, real website tasks",
    github: "https://github.com/autoppia/autoppia_web_agents_subnet",
    twitter: "https://twitter.com/AutoppiaAI",
    website: "https://autoppia.com/web-agents-subnet-36",
    builtBy: "Autoppia",
    status: "active",
    type: "inference"
  },
  37: {
    name: "Fine-tuning",
    brandName: "Macrocosmos Fine-tuning",
    description: "LLM fine-tuning subnet focusing on reasoning models",
    sector: "LLM Fine-tuning",
    specialization: "Multiple fine-tuning competitions, reasoning models, AI model optimization",
    github: "https://github.com/macrocosm-os/finetuning",
    twitter: "https://twitter.com/MacrocosmosAI",
    website: "https://www.macrocosmos.ai/sn37",
    builtBy: "Macrocosmos AI",
    status: "active",
    type: "training"
  },
  38: {
    name: "Distributed Training",
    brandName: "Distributed Training (formerly Sylliba/Tatsu)",
    description: "Distributed training for Large Language Models using collaborative methods",
    sector: "Distributed Training",
    specialization: "Collaborative LLM training, distributed approaches, network-wide model development",
    github: null,
    twitter: null,
    website: null,
    builtBy: "TBD",
    status: "active",
    type: "training"
  },
  39: {
    name: "Basilica",
    brandName: "Basilica (formerly EdgeMaxxing)",
    description: "Decentralized compute base layer for Bittensor AI-native services",
    sector: "Decentralized Compute",
    specialization: "AI-native compute, training, inference, consumer device optimization",
    github: "https://github.com/womboai/edge-maxxing",
    twitter: "https://twitter.com/taoinsider",
    website: null,
    builtBy: "Current team TBD",
    status: "active",
    type: "compute"
  },
  40: {
    name: "Chunking",
    brandName: "VectorChat Chunking",
    description: "RAG optimization through intelligent document processing",
    sector: "Data Processing",
    specialization: "Retrieval-Augmented Generation, document chunking, text/image/audio processing",
    github: "https://github.com/VectorChat/chunking_subnet",
    twitter: "https://twitter.com/vectorchatai",
    website: null,
    builtBy: "VectorChat",
    status: "active",
    type: "data"
  },
  41: {
    name: "Sportstensor",
    brandName: "Sportstensor",
    description: "Sports prediction algorithms powered by Bittensor network",
    sector: "Sports AI",
    specialization: "Sports forecasting, prediction algorithms, competitive advantages in sports analytics",
    github: null,
    twitter: null,
    website: null,
    builtBy: "Sportstensor Team",
    status: "active",
    type: "inference"
  },
  42: {
    name: "Masa",
    brandName: "Masa Finance",
    description: "Real-time data layer powering AI agents with TEE security",
    sector: "Data Collection",
    specialization: "Permissionless data aggregation, X/Twitter data, social media collection, TEE technology",
    github: "https://github.com/masa-finance/masa-bittensor",
    twitter: "https://twitter.com/getmasafi",
    website: "https://developers.masa.ai/docs/masa-subnet/intro-42",
    builtBy: "Masa Finance",
    status: "active",
    type: "data"
  },
  43: {
    name: "Graphite",
    brandName: "GraphiteAI",
    description: "Decentralized graph optimization and intelligent path planning",
    sector: "Graph Optimization",
    specialization: "Graph optimization problems, path planning, network analysis, computational challenges",
    github: "https://github.com/GraphiteAI/Graphite-Subnet",
    twitter: "https://twitter.com/GraphiteSubnet",
    website: null,
    builtBy: "GraphiteAI",
    status: "active",
    type: "compute"
  },
  44: {
    name: "Score",
    brandName: "Score Technologies",
    description: "Decentralized computer vision for sports analytics and video analysis",
    sector: "Computer Vision",
    specialization: "Sports video analysis, computer vision processing, sports insights and predictions",
    github: "https://github.com/score-technologies/score-vision",
    twitter: null,
    website: null,
    builtBy: "Score Technologies",
    status: "active",
    type: "inference"
  },
  45: {
    name: "SWE-Rizzo",
    brandName: "Gen42/Brokespace",
    description: "AI-powered code generation and automated bug fixing",
    sector: "Software Engineering",
    specialization: "Code generation, automated bug fixing, software development tools",
    github: "https://github.com/brokespace/code/",
    twitter: null,
    website: null,
    builtBy: "Gen42/Brokespace",
    status: "active",
    type: "inference"
  },
  46: {
    name: "Neural3D",
    brandName: "NeuralAI",
    description: "3D asset generation for gaming and virtual experiences",
    sector: "3D Asset Generation",
    specialization: "3D model generation, gaming assets, virtual experiences, prompt-to-3D transformation",
    github: null,
    twitter: "https://twitter.com/GoNeuralAI",
    website: "https://docs.goneural.ai/neuralai/products/bittensor-sn-46",
    builtBy: "NeuralAI",
    status: "active",
    type: "inference"
  },
  47: {
    name: "For Sale (Condense)",
    brandName: "Abandoned",
    description: "Ghost registration - no evidence of activity",
    sector: "Unknown",
    specialization: "No evidence of activity found",
    github: null,
    twitter: null,
    website: null,
    builtBy: null,
    status: "abandoned",
    type: "unknown"
  },
  48: {
    name: "NextPlace",
    brandName: "NextPlace (Nickel5)",
    description: "Real estate valuation prediction through AI-powered market analysis",
    sector: "Real Estate AI",
    specialization: "Property valuation, home value estimates, real estate market data analysis",
    github: null,
    twitter: null,
    website: "https://nextplace.ai",
    builtBy: "Nickel5 Inc",
    status: "active",
    type: "inference"
  },
  49: {
    name: "Polaris",
    brandName: "Polaris Cloud",
    description: "Decentralized GPU compute marketplace and management layer",
    sector: "Decentralized Compute",
    specialization: "GPU capacity pooling, computational resources, global compute access",
    github: null,
    twitter: null,
    website: "https://polariscloud.ai",
    builtBy: "Polaris Team",
    status: "active",
    type: "compute"
  },
  50: {
    name: "Synth",
    brandName: "Mode Network",
    description: "Decentralized AI for crypto price prediction",
    sector: "Financial AI",
    specialization: "Cryptocurrency price prediction, decentralized market forecasting",
    github: null,
    twitter: "https://twitter.com/modenetwork",
    website: null,
    builtBy: "Mode Network",
    status: "active",
    type: "inference"
  },
  51: {
    name: "Celium",
    brandName: "Commune AI",
    description: "GPU marketplace and compute infrastructure",
    sector: "GPU Marketplace",
    specialization: "Decentralized GPU access, computational resources for AI/ML workloads",
    github: "https://github.com/commune-ai/celium",
    twitter: null,
    website: null,
    builtBy: "Commune AI",
    status: "active",
    type: "compute"
  },
  52: {
    name: "Dojo",
    brandName: "Dojo",
    description: "Data labeling and human feedback for AI model training ($1M+ revenue)",
    sector: "Data Labeling",
    specialization: "Human-preference feedback, data labeling, AI model training enhancement",
    github: null,
    twitter: null,
    website: null,
    builtBy: "Dojo Team",
    status: "active",
    type: "data"
  },
  53: {
    name: "Efficient Frontier",
    brandName: "SignalPlus",
    description: "First real-market trading subnet with $22M+ cumulative profits",
    sector: "Financial Trading",
    specialization: "Real-market trading, financial algorithms, institutional trading applications",
    github: null,
    twitter: "https://twitter.com/Effi_Frontier",
    website: null,
    builtBy: "SignalPlus",
    status: "active",
    type: "trading"
  },
  54: {
    name: "MIID",
    brandName: "Yanez Compliance (formerly Tatsu)",
    description: "Synthetic identity generation for testing and compliance (F1-score 0.88)",
    sector: "Synthetic Data",
    specialization: "Synthetic identity generation, compliance testing, identity verification",
    github: null,
    twitter: "https://twitter.com/TatsuEcosystem",
    website: "https://www.yanezcompliance.com",
    builtBy: "Yanez Compliance",
    status: "active",
    type: "data"
  },
  55: {
    name: "Precog",
    brandName: "Coin Metrics (Yuma collaboration)",
    description: "Crypto-asset price forecasting with 1-hour Bitcoin predictions",
    sector: "Financial Prediction",
    specialization: "Bitcoin price forecasting, 1-hour ahead predictions, crypto-asset analysis",
    github: null,
    twitter: null,
    website: null,
    builtBy: "Coin Metrics x Yuma",
    status: "active",
    type: "inference"
  },
  56: {
    name: "Gradients",
    brandName: "Rayon Labs",
    description: "AI training and model development in Rayon Labs ecosystem",
    sector: "AI Training",
    specialization: "AI model development, training capabilities, ecosystem integration",
    github: "https://github.com/rayonlabs/gradients",
    twitter: "https://twitter.com/rayon_labs",
    website: "https://gradients.ai/",
    builtBy: "Rayon Labs",
    status: "active",
    type: "training"
  },
  57: {
    name: "Gaia",
    brandName: "Gaia AI",
    description: "Earth system science and environmental AI modeling",
    sector: "Earth System Science",
    specialization: "Earth system modeling, environmental understanding, planetary interactions",
    github: null,
    twitter: "https://twitter.com/Gaia_AI_",
    website: null,
    builtBy: "Gaia AI Team",
    status: "active",
    type: "inference"
  },
  61: {
    name: "RedTeam",
    brandName: "RedTeam Security",
    description: "Cybersecurity and AI security testing",
    sector: "Cybersecurity",
    specialization: "AI security testing, red team operations, adversarial testing methodologies",
    github: null,
    twitter: null,
    website: null,
    builtBy: "RedTeam Security Team",
    status: "active",
    type: "security"
  },
  62: {
    name: "Ridges AI",
    brandName: "Ridges AI (formerly AgentTAO)",
    description: "Autonomous development marketplace for intelligent software agents",
    sector: "Software Engineering",
    specialization: "Autonomous software development, CI/CD testing, programming problem solving",
    github: null,
    twitter: "https://twitter.com/ridges_ai",
    website: null,
    builtBy: "Ridges AI Team",
    status: "active",
    type: "inference"
  },
  64: {
    name: "Chutes",
    brandName: "Rayon Labs",
    description: "Serverless compute in Rayon Labs ecosystem",
    sector: "Serverless Compute",
    specialization: "On-demand computational resources, serverless computing, ecosystem support",
    github: null,
    twitter: "https://twitter.com/rayon_labs",
    website: null,
    builtBy: "Rayon Labs",
    status: "active",
    type: "compute"
  },
  65: {
    name: "TAO Private Network",
    brandName: "TPN",
    description: "Decentralized anonymous VPN network with censorship resistance",
    sector: "Decentralized VPN",
    specialization: "Anonymous VPN, censorship-resistant internet access, privacy-focused networking",
    github: null,
    twitter: null,
    website: null,
    builtBy: "TPN Team",
    status: "active",
    type: "infrastructure"
  },
  66: {
    name: "FakeNews",
    brandName: "FakeNews",
    description: "Decentralized fact-checking and misinformation detection",
    sector: "AI Detection",
    specialization: "Fact-checking, misinformation detection, collective intelligence verification",
    github: null,
    twitter: null,
    website: null,
    builtBy: "FakeNews Team",
    status: "active",
    type: "evaluation"
  },
  68: {
    name: "NOVA",
    brandName: "Metanova Labs",
    description: "Early-stage drug discovery with virtual screening beyond SOTA",
    sector: "Drug Discovery",
    specialization: "Drug discovery, virtual drug screening, pharmaceutical research, transparent validation",
    github: null,
    twitter: "https://twitter.com/metanova_labs",
    website: "https://www.metanova-labs.com/",
    builtBy: "Metanova Labs",
    status: "active",
    type: "inference"
  },
  69: {
    name: "Compute Subnet",
    brandName: "Miners Union",
    description: "Decentralized GPU marketplace allowing global resource rental",
    sector: "Decentralized Computing",
    specialization: "GPU resource contribution, global resource pool, computational task marketplace",
    github: "https://github.com/minersunion/compute-subnet-69",
    twitter: null,
    website: null,
    builtBy: "Miners Union",
    status: "active",
    type: "compute"
  },
  70: {
    name: "Vericore",
    brandName: "Vericore",
    description: "Rapid AI-powered fact-checking at scale with precise sourcing",
    sector: "Fact-Checking",
    specialization: "Rapid fact-checking, precise quotes and sources, claim validation, misinformation fighting",
    github: null,
    twitter: null,
    website: null,
    builtBy: "Vericore Team",
    status: "active",
    type: "evaluation"
  },
  72: {
    name: "StreetVision",
    brandName: "NATIX",
    description: "Crowdsourced video data collection for real-world AI training",
    sector: "Computer Vision",
    specialization: "Real-world AI training, crowdsourced video data, street-level data collection",
    github: null,
    twitter: null,
    website: null,
    builtBy: "NATIX",
    status: "active",
    type: "data"
  },
  73: {
    name: "MetaHash",
    brandName: "FX Integral",
    description: "Decentralized OTC marketplace for ALPHA/META token swapping",
    sector: "DeFi",
    specialization: "OTC marketplace, ALPHA rewards swapping, META tokens, slippage-free trading",
    github: "https://github.com/fx-integral/metahash",
    twitter: null,
    website: null,
    builtBy: "FX Integral",
    status: "active",
    type: "trading"
  },
  75: {
    name: "Hippius",
    brandName: "Hippius",
    description: "Decentralized cloud storage like Dropbox/AWS but community-run",
    sector: "Decentralized Storage",
    specialization: "Cloud storage, compute platform, censorship-resistant, community governance",
    github: null,
    twitter: "https://twitter.com/hippius_subnet",
    website: null,
    builtBy: "Hippius Team",
    status: "active",
    type: "storage"
  },
  76: {
    name: "Safe Scan",
    brandName: "Safe Scan",
    description: "AI cancer detection for underserved communities worldwide",
    sector: "Medical AI",
    specialization: "Cancer detection, medical AI, underserved communities, healthcare accessibility",
    github: null,
    twitter: null,
    website: null,
    builtBy: "Safe Scan Team",
    status: "active",
    type: "inference"
  },
  77: {
    name: "Liquidity",
    brandName: "Liquidity",
    description: "Bridge between Bittensor and DeFi with liquidity provisioning incentives",
    sector: "DeFi",
    specialization: "Liquidity provisioning, DeFi integration, collective intelligence finance bridge",
    github: null,
    twitter: null,
    website: null,
    builtBy: "Liquidity Team",
    status: "active",
    type: "hybrid"
  },
  79: {
    name: "TAOS",
    brandName: "TAOS",
    description: "Simulation of automated trading in intelligent markets",
    sector: "Trading Simulation",
    specialization: "Automated trading simulation, intelligent markets, trading algorithm development",
    github: null,
    twitter: "https://twitter.com/taos_im",
    website: "https://taos.im/",
    builtBy: "TAOS Team",
    status: "active",
    type: "simulation"
  },
  88: {
    name: "Investing",
    brandName: "Mobius Fund",
    description: "Optimizing staking strategies within the Tao/Alpha ecosystem",
    sector: "Investment Strategy",
    specialization: "Staking optimization, Bittensor subnet strategies, investment strategy development",
    github: null,
    twitter: "https://twitter.com/StakingAlpha88",
    website: null,
    builtBy: "Mobius Fund",
    status: "active",
    type: "hybrid"
  },
  93: {
    name: "Bitcast",
    brandName: "Bitcast Network",
    description: "Incentivizing creators to produce Bittensor content for TAO rewards",
    sector: "Creator Economy",
    specialization: "Content creator incentivization, brand-related content, creator-driven marketing",
    github: "https://github.com/bitcast-network/bitcast",
    twitter: "https://twitter.com/Bitcast_network",
    website: null,
    builtBy: "Bitcast Network",
    status: "active",
    type: "social"
  },
  96: {
    name: "FLock.io",
    brandName: "FLock.io",
    description: "Federated learning for decentralized AI model training",
    sector: "Federated Learning",
    specialization: "Collaborative machine learning, data privacy preservation, decentralized training",
    github: null,
    twitter: null,
    website: null,
    builtBy: "FLock.io Team",
    status: "active",
    type: "training"
  },
  106: {
    name: "VoidAI",
    brandName: "VoidAI",
    description: "Cross-chain liquidity coordination via Solana using wTAO tokens",
    sector: "Cross-Chain Infrastructure",
    specialization: "Cross-chain liquidity, Solana bridge, wTAO tokens, interoperability",
    github: null,
    twitter: null,
    website: null,
    builtBy: "VoidAI Team",
    status: "active",
    type: "infrastructure"
  },
  111: {
    name: "oneoneone",
    brandName: "oneoneone",
    description: "Web content validation and curation for AI training",
    sector: "Web Content Validation",
    specialization: "User-generated content collection, content validation, AI training data curation",
    github: null,
    twitter: null,
    website: null,
    builtBy: "oneoneone Team",
    status: "active",
    type: "data"
  },
  120: {
    name: "Affine",
    brandName: "Affine",
    description: "First decentralized vertical integration through subnet composition",
    sector: "Decentralized Vertical Integration",
    specialization: "Subnet composition, permissionless incentive mechanisms, innovation integration",
    github: null,
    twitter: null,
    website: null,
    builtBy: "Affine Team",
    status: "active",
    type: "hybrid"
  }
};

/**
 * Sector mappings for filtering and organization
 */
export const SUBNET_SECTORS = {
  "AI Training": ["AI Training", "LLM Fine-tuning", "Distributed Training", "Federated Learning"],
  "AI Inference": ["Text Generation", "AI Inference", "Conversational AI", "Mathematical Reasoning"],
  "Computer Vision": ["Multi-Modality", "Computer Vision", "3D Asset Generation"],
  "Data & Storage": ["Data Collection", "Data Processing", "Dataset Creation", "Decentralized Storage", "Web Content Validation"],
  "Financial AI": ["Financial AI", "Financial Trading", "Financial Prediction", "Trading Simulation", "Investment Strategy", "DeFi"],
  "Infrastructure": ["Infrastructure", "Network Infrastructure", "Decentralized Compute", "Serverless Compute", "GPU Marketplace", "Cross-Chain Infrastructure", "Decentralized VPN"],
  "AI Detection": ["AI Detection", "AI Evaluation", "Fact-Checking", "Zero-Knowledge ML"],
  "Gaming & 3D": ["3D Asset Generation", "Gaming"],
  "Healthcare & Science": ["Decentralized Science", "Medical AI", "Drug Discovery", "Earth System Science", "Climate Forecasting"],
  "Security & Privacy": ["Cybersecurity", "AI Detection", "Mining"],
  "Social & Content": ["Social Intelligence", "Creator Economy", "Web Search", "AI Search"],
  "Software Engineering": ["Code Generation", "Software Engineering", "Autonomous Web Agents"],
  "Sports & Prediction": ["Sports AI", "Sports Prediction"],
  "Other": ["Graph Optimization", "Real Estate AI", "Synthetic Data", "Unknown"]
};

/**
 * Get enhanced subnet metadata by ID with fallback to basic metadata
 */
export function getEnhancedSubnetMetadata(subnetId) {
  const enhanced = ENHANCED_SUBNET_DATABASE[subnetId];
  if (enhanced) {
    return {
      id: subnetId,
      ...enhanced,
      // Ensure compatibility with existing code
      github: enhanced.github,
      twitter: enhanced.twitter,
      website: enhanced.website
    };
  }
  
  // Fallback for subnets not in enhanced database
  return {
    id: subnetId,
    name: `Subnet ${subnetId}`,
    brandName: `Subnet ${subnetId}`,
    description: `Bittensor subnet ${subnetId} - metadata not available`,
    sector: "Other",
    specialization: "No specialization data available",
    github: `https://github.com/bittensor-subnet/subnet-${subnetId}`,
    twitter: null,
    website: null,
    builtBy: "Unknown",
    status: "unknown",
    type: "unknown"
  };
}

/**
 * Get all enhanced subnet metadata
 */
export function getAllEnhancedSubnetMetadata() {
  return ENHANCED_SUBNET_DATABASE;
}

/**
 * Get subnets by sector
 */
export function getSubnetsBySector(sector) {
  if (sector === 'All') {
    return Object.entries(ENHANCED_SUBNET_DATABASE)
      .map(([id, metadata]) => ({ id: parseInt(id), ...metadata }));
  }
  
  const sectorSubnets = SUBNET_SECTORS[sector];
  if (!sectorSubnets) return [];
  
  return Object.entries(ENHANCED_SUBNET_DATABASE)
    .filter(([, metadata]) => sectorSubnets.includes(metadata.sector))
    .map(([id, metadata]) => ({ id: parseInt(id), ...metadata }));
}

/**
 * Get all available sectors for filtering
 */
export function getAllSectors() {
  return ['All', ...Object.keys(SUBNET_SECTORS)];
}

/**
 * Search enhanced subnets by name, brand, or specialization
 */
export function searchEnhancedSubnets(query) {
  const lowercaseQuery = query.toLowerCase();
  
  return Object.entries(ENHANCED_SUBNET_DATABASE)
    .filter(([id, metadata]) => 
      metadata.name.toLowerCase().includes(lowercaseQuery) ||
      metadata.brandName.toLowerCase().includes(lowercaseQuery) ||
      metadata.description.toLowerCase().includes(lowercaseQuery) ||
      metadata.sector.toLowerCase().includes(lowercaseQuery) ||
      metadata.specialization.toLowerCase().includes(lowercaseQuery) ||
      id === query
    )
    .map(([id, metadata]) => ({ id: parseInt(id), ...metadata }));
}

/**
 * Get subnet count by status
 */
export function getSubnetStats() {
  const stats = {
    total: Object.keys(ENHANCED_SUBNET_DATABASE).length,
    active: 0,
    decommissioned: 0,
    abandoned: 0
  };
  
  Object.values(ENHANCED_SUBNET_DATABASE).forEach(subnet => {
    if (subnet.status === 'active') stats.active++;
    else if (subnet.status === 'decommissioned') stats.decommissioned++;
    else if (subnet.status === 'abandoned') stats.abandoned++;
  });
  
  return stats;
}