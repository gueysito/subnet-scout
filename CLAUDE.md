# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Subnet Scout Agent** is an AI-powered monitoring system for all 118+ Bittensor subnets, built for the io.net Hackathon Q2 2025. It's a full-stack application with breakthrough performance (109x faster processing, 83% cost savings) and complete real-time data integration.

## Development Commands

### Start Development Environment

```bash
# Full development setup (recommended)
npm run dev:full      # Frontend + unified backend
npm run dev          # Frontend only (localhost:5173)
npm run backend      # Unified production backend (localhost:8080)
npm run backend:simple  # Legacy simple backend (fallback)
```

### Production Deployment

```bash
npm run backend      # Unified zero-dependency production server
```

### Testing

```bash
npm run test:all           # Complete test suite
npm run test:integration   # Backend integration tests
npm run test:frontend     # Frontend integration tests
npm run test:step4        # Complete system tests
npm run lint              # ESLint validation
```

### Build & Deploy

```bash
npm run build    # Production build
npm run preview  # Preview production build
```

## Architecture Overview

### Multi-Language Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS (SPA)
- **Backend**: Node.js + Express with Python Ray integration
- **Database**: PostgreSQL (optional) + Redis caching
- **AI Integration**: io.net, Anthropic Claude, OpenAI
- **Bot**: Telegram Bot with advanced AI features

### Key Services

- **pingAgent.js**: Main Express backend server (port 8080)
- **telegramBot.js**: Telegram bot service with AI capabilities
- **mock-server.js**: Development mock server (port 3001)
- **core/distributed_monitor.py**: Python Ray distributed processing

### Data Flow Architecture

```
External APIs → Backend Services → Cache Layer → Frontend
     ↓
Telegram Bot ← AI Processing ← Real-time Analysis
```

## Core Components

### Frontend Architecture (`src/`)

- **components/**: React UI components (AdvancedFilters, SubnetCard, DistributedMonitor, PredictiveAnalyticsDashboard)
- **pages/**: Route pages (Home, Explore, AIInsights, HealthDashboard)
- **scoring/**: AI analysis engines (IONetClient, EnhancedScoreAgent, RiskAssessmentEngine, AnomalyDetectionEngine)
- **utils/**: Backend services (apiClient, cacheService, githubClient, kaitoYapsService, healthMonitor)

### Backend Services

- **API Gateway**: Express.js with rate limiting, security headers
- **Caching Layer**: Redis with intelligent TTL management (5min subnets, 30min GitHub, 1hr AI)
- **AI Orchestration**: Multiple AI providers with fallback strategies
- **Real-time Processing**: Python Ray for distributed subnet monitoring

### Key API Endpoints

```
GET  /health                    # System health monitoring
GET  /api/agents               # Subnet data (agent format)
GET  /api/subnet/:id/data      # Individual subnet info
POST /api/monitor/distributed  # Distributed monitoring
POST /api/score/enhanced       # AI-powered analysis
GET  /api/insights/forecast    # 7-day predictions
GET  /api/github-stats/:id     # Development activity
```

## Environment Configuration

### Required Environment Variables

```bash
# Core APIs
IONET_API_KEY=your_key           # io.net AI models (primary)
TAOSTATS_API_USERNAME=username   # Bittensor data
TELEGRAM_BOT_TOKEN=token         # Multi-platform access
CLAUDE_API_KEY=key              # Enhanced analysis

# Development
VITE_USE_MOCK_API=false          # Force real data usage
VITE_BACKEND_URL=http://localhost:8080
```

## Advanced Features

### Distributed Processing

- Python Ray framework processes all 118 subnets in 5.37 seconds
- 22 subnets/second throughput with 100% success rate
- Bridge between Node.js and Python via `core/monitor_bridge.js`

### Multi-AI Integration

- **io.net Intelligence**: Primary AI provider (hackathon compliant)
- **Anthropic Claude**: Enhanced analysis capabilities
- **Multiple model selection**: Specialized tasks with fallback strategies

### Real-time Data Sources

- **TaoStats API**: Live Bittensor subnet metrics
- **GitHub API**: Development activity tracking
- **Kaito Yaps API**: Social sentiment/attention metrics
- **Ethos Network**: Identity verification

### Security & Production

- **Helmet middleware**: CSP, XSS protection
- **Rate limiting**: 100 req/min general, 20/5min compute-intensive
- **Winston logging**: Structured error tracking
- **Redis caching**: Performance optimization (60%+ response time reduction)

## Development Notes

### Testing Strategy

- Integration tests with 87.5%+ success rates
- Frontend component testing
- Complete system validation
- Mock server for development isolation

### Performance Optimizations

- Intelligent caching with Redis TTL strategies
- Distributed processing with Python Ray
- Graceful degradation when external services unavailable
- Compression and CORS optimization

### Current Status

- **Branch**: feature/functional-ui-webapp
- **Status**: Production-ready with comprehensive feature set
- **Recent Focus**: Complete real data integration and functional UI
- **Architecture**: Multi-language, distributed, AI-powered monitoring system
