# Core Communications Documentation
*Subnet Scout System Architecture & Integration Guide*

---

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Component Interaction Map](#component-interaction-map)
3. [Communication Pathways](#communication-pathways)
4. [Data Flow Protocols](#data-flow-protocols)
5. [API Contracts Reference](#api-contracts-reference)
6. [Environment Configuration](#environment-configuration)
7. [Integration Patterns](#integration-patterns)
8. [Communication Flow Examples](#communication-flow-examples)

---

## System Architecture Overview

Subnet Scout is built as a multi-layer application with clear separation of concerns and environment-aware API switching. The system enables seamless development with mock services while supporting production deployment with real external APIs.

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                           │
│  React + Vite (localhost:5173)                             │
│  • React Components (SubnetCard, StatsDashboard, etc.)     │
│  • Custom Hooks (useApi, useSubnetAgents, useApiHealth)    │
│  • State Management & Error Handling                       │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP Requests (JSON)
┌─────────────────────▼───────────────────────────────────────┐
│                  API CLIENT LAYER                           │
│  apiClient.js - Environment-Aware Request Handler          │
│  • Mock/Real API Switching                                 │
│  • Centralized Error Handling                             │
│  • Authentication Management                               │
└─────────────────────┬───────────────────────────────────────┘
                      │ Environment Switch
        ┌─────────────┴─────────────┐
        │                           │
┌───────▼─────────┐         ┌───────▼─────────┐
│   MOCK LAYER    │         │  BACKEND LAYER  │
│ localhost:3001  │         │ localhost:8080  │
│ • Mock Endpoints│         │ • Express Routes│
│ • Test Data     │         │ • ScoreAgent    │
│ • Error Sim.    │         │ • Health Checks │
└─────────────────┘         └───────┬─────────┘
                                    │
                          ┌─────────▼─────────┐
                          │  SCORING ENGINE   │
                          │   ScoreAgent.js   │
                          │ • Claude AI       │
                          │ • Multi-factor    │
                          │   Algorithm       │
                          └─────────┬─────────┘
                                    │
                          ┌─────────▼─────────┐
                          │  EXTERNAL APIs    │
                          │ • io.net (GPU)    │
                          │ • TaoStats (Data) │
                          │ • Telegram (Bot)  │
                          │ • Claude (AI)     │
                          └───────────────────┘
```

---

## Component Interaction Map

### 1. Frontend Components

**Primary Components:**
- **`App.jsx`** - Main application router and state container
- **`SubnetCard.jsx`** - Individual subnet display and scoring
- **`StatsDashboard.jsx`** - System-wide statistics and health
- **`ScoreAgentDemo.jsx`** - Live scoring demonstration
- **`AgentStatus.jsx`** - Real-time agent monitoring

**Custom Hooks:**
```javascript
// Primary API Hook
useApi() → {
  loading, error, apiMode,
  getAgentsList, calculateScore, healthCheck,
  toggleApiMode, clearError
}

// Specialized Hooks
useSubnetAgents(autoFetch) → { agents, pagination, stats, ... }
useSubnetScore(subnetId) → { score, loading, error, fetchScore }
useApiHealth() → { health, lastCheck, checkHealth }
```

### 2. API Client Architecture

**File:** `src/utils/apiClient.js`

```javascript
class ApiClient {
  constructor() {
    this.useMock = API_CONFIG.USE_MOCK
  }
  
  // Core Methods
  fetchWithErrorHandling(url, options)
  getIoNetAgents()
  getTaoStatsData(netuid, options)
  calculateScore(subnetId, metrics, timeframe)
  getAgentsList(page, limit)
  healthCheck()
  
  // Utility Methods
  toggleMockMode()
  getCurrentMode()
  simulateError(type)
}
```

### 3. Backend Server Structure

**File:** `pingAgent.js`

```javascript
// Main Express App
app.post("/ping")           // Claude AI chat endpoint
app.post("/api/score")      // Single subnet scoring
app.post("/api/score/batch") // Batch subnet scoring  
app.get("/health")          // System health check
```

### 4. Scoring Engine Components

**File:** `src/scoring/ScoreAgent.js`

```javascript
class ScoreAgent {
  // Core Scoring Methods
  calculateScore(subnetId, metrics, timeframe)
  calculateBatchScores(subnetMetrics, timeframe)
  
  // Component Calculators
  calculateYieldScore(metrics)
  calculateActivityScore(metrics) 
  calculateCredibilityScore(metrics)
  
  // AI Integration
  generateAISummary(subnetId, scores)
  
  // Utility Methods
  validateMetrics(metrics)
  determineRiskLevel(overallScore, metrics)
}
```

---

## Communication Pathways

### 1. Frontend → API Client
**Protocol:** HTTP POST/GET requests
**Data Format:** JSON
**Error Handling:** Try/catch with state management

```javascript
// Example: Subnet score request
const scoreData = await calculateScore(subnetId, metrics, '24h');
```

### 2. API Client → Backend/Mock
**Environment Switch Logic:**
```javascript
const url = this.useMock 
  ? `${MOCK_BASE_URL}/api/score`
  : `${BACKEND_BASE_URL}/api/score`;
```

**Authentication Patterns:**
- **Mock Mode:** No authentication required
- **Real Mode:** API keys, Basic Auth, Bearer tokens

### 3. Backend → Scoring Engine
**Integration Pattern:**
```javascript
const scoreResult = await scoreAgent.calculateScore(subnet_id, metrics, timeframe);
```

### 4. Scoring Engine → External APIs
**Claude AI Integration:**
```javascript
const response = await this.claude.messages.create({
  model: "claude-3-sonnet-20240229",
  max_tokens: 300,
  messages: [{ role: "user", content: analysisPrompt }]
});
```

**TaoStats API Integration:**
```javascript
const url = `${TAOSTATS_BASE_URL}/api/dtao/pool/history/v1?${params}`;
const headers = { 
  'Authorization': `${username}:${password}`,
  'Accept': 'application/json'
};
```

---

## Data Flow Protocols

### 1. Standard Request Flow
```
User Action → React Component → Custom Hook → API Client → 
Environment Switch → Backend/Mock → Response Processing → 
State Update → UI Re-render
```

### 2. Scoring Data Flow
```
Frontend Request → API Client → Backend (/api/score) → 
ScoreAgent.calculateScore() → External API Calls → 
Claude AI Analysis → Score Calculation → Response Assembly → 
Backend Response → Frontend State Update
```

### 3. Error Propagation Flow
```
External API Error → ScoreAgent Error Handler → 
Backend Error Response → API Client Error Handler → 
Custom Hook Error State → Component Error Display
```

### 4. Environment Switching Flow
```
Environment Variable (VITE_USE_MOCK_API) → 
API Client Constructor → useMock Flag → 
URL Selection Logic → Endpoint Routing
```

---

## Component Communication Protocols

### HTTP Request Standards
- **Content-Type:** `application/json`
- **Methods:** GET (data retrieval), POST (scoring, actions)
- **Status Codes:** 200 (success), 400 (bad request), 401 (auth), 404 (not found), 500 (server error)

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_TYPE",
    "message": "Human readable message",
    "timestamp": "2025-06-26T10:30:00Z"
  }
}
```

### Data Validation Patterns
- **Frontend:** React prop types and form validation
- **API Client:** Request parameter validation
- **Backend:** Request body schema validation
- **ScoreAgent:** Metrics validation with detailed error messages

---

## API Contracts Reference

### Frontend API Interface

The frontend communicates with the backend through the `apiClient.js` centralized interface. All API calls are environment-aware and include comprehensive error handling.

#### Primary Frontend API Methods

```javascript
// 1. Subnet Agents List
await apiClient.getAgentsList(page = 1, limit = 20)
// Returns: { agents: [], pagination: {}, total_count: 118, healthy_count: 95 }

// 2. Individual Subnet Scoring  
await apiClient.calculateScore(subnetId, metrics, timeframe = '24h')
// Returns: { subnet_id, overall_score, breakdown: {}, metrics: {}, ai_summary }

// 3. External GPU Agents
await apiClient.getIoNetAgents()
// Returns: { agents: [], total_count: 327000, available_count: 245000 }

// 4. Subnet Historical Data
await apiClient.getTaoStatsData(netuid = 1, options = {})
// Returns: [{ netuid, block_number, timestamp, price, emission_rate, ... }]

// 5. System Health Check
await apiClient.healthCheck()
// Returns: { status: 'healthy', timestamp, uptime, environment }

// 6. Telegram Bot Integration
await apiClient.sendTelegramMessage(message)
// Returns: { method: 'sendMessage', chat_id, text, parse_mode }
```

### Backend API Endpoints

**Base URL:** `http://localhost:8080` (development) | `https://your-domain.com` (production)

#### 1. Subnet Scoring Endpoint
```http
POST /api/score
Content-Type: application/json

Request Body:
{
  "subnet_id": 1,
  "metrics": {
    "emission_rate": 1250.5,
    "total_stake": 125000.75,
    "validator_count": 256,
    "activity_score": 85.2,
    "price_history": [0.025, 0.024, 0.026]
  },
  "timeframe": "24h"
}

Response (200 OK):
{
  "subnet_id": 1,
  "overall_score": 87,
  "breakdown": {
    "yield_score": 89,
    "activity_score": 85,
    "credibility_score": 92
  },
  "weights": {
    "yield": 40,
    "activity": 30,
    "credibility": 30
  },
  "metrics": {
    "current_yield": 12.4,
    "yield_change_24h": 0.8,
    "activity_level": "high",
    "risk_level": "low",
    "validator_efficiency": 94.2,
    "network_participation": 88.7
  },
  "ai_summary": "Subnet 1 shows strong performance with consistent yields...",
  "timestamp": "2025-06-26T10:30:00Z",
  "timeframe": "24h",
  "calculation_details": {
    "yield_calculation": "...",
    "activity_calculation": "...",
    "credibility_calculation": "..."
  }
}
```

#### 2. Batch Scoring Endpoint
```http
POST /api/score/batch
Content-Type: application/json

Request Body:
{
  "subnet_metrics": {
    "1": { "emission_rate": 1250.5, "total_stake": 125000.75, ... },
    "5": { "emission_rate": 890.2, "total_stake": 98000.45, ... },
    "99": { "emission_rate": 456.8, "total_stake": 45000.12, ... }
  },
  "timeframe": "24h"
}

Response (200 OK):
{
  "results": [
    {
      "subnet_id": 1,
      "overall_score": 87,
      "status": "success",
      "processing_time_ms": 1240
    },
    {
      "subnet_id": 5,
      "overall_score": 73,
      "status": "success", 
      "processing_time_ms": 1180
    }
  ],
  "errors": [
    {
      "subnet_id": 99,
      "error": "Insufficient metrics data",
      "status": "failed"
    }
  ],
  "summary": {
    "total_requested": 3,
    "successful": 2,
    "failed": 1,
    "total_processing_time_ms": 2420
  },
  "timestamp": "2025-06-26T10:30:00Z"
}
```

#### 3. Claude AI Chat Endpoint
```http
POST /ping
Content-Type: application/json

Request Body:
{
  "input": "What is the best performing subnet in the Bittensor network?"
}

Response (200 OK):
{
  "reply": "Based on current metrics, subnet 1 (Text Prompting) shows strong performance..."
}
```

#### 4. Health Check Endpoint
```http
GET /health

Response (200 OK):
{
  "status": "healthy",
  "timestamp": "2025-06-26T10:30:00Z",
  "uptime": 86400,
  "environment": "development",
  "scoring_engine": "active"
}
```

### Mock Server API Endpoints

**Base URL:** `http://localhost:3001` (development only)

The mock server provides realistic test data for all endpoints during development:

#### Mock Endpoints Overview
```javascript
// Mock io.net API
GET /api/ionet/agents
// Returns: Realistic GPU agent data with 20 agents

// Mock TaoStats API  
GET /api/taostats/pool/history?netuid=1&page=1&limit=10
// Returns: Historical subnet data with proper authentication simulation

// Mock Scoring API
POST /api/score
// Returns: Calculated scores with AI-like summaries and realistic metrics

// Mock Agents List
GET /api/agents?page=1&limit=20
// Returns: Paginated subnet list with scores and statistics

// Mock Telegram Webhook
POST /webhook/telegram
// Returns: Bot response with command parsing (supports /score, /help)

// Mock Health Check
GET /health
// Returns: System health status
```

### External API Integration Contracts

#### 1. io.net GPU Agents API
```http
GET https://api.io.net/v1/agents
Authorization: Bearer io-v1-your-key-here

Response:
{
  "agents": [
    {
      "id": "agent_123",
      "status": "active" | "idle" | "busy",
      "gpu_type": "RTX4090" | "A100" | "H100",
      "location": "us-west-1",
      "price_per_hour": 0.25,
      "capabilities": ["inference", "training"],
      "last_ping": "2025-06-26T10:30:00Z"
    }
  ],
  "total_count": 327000,
  "available_count": 245000
}
```

#### 2. TaoStats Historical Data API
```http
GET https://api.taostats.io/api/dtao/pool/history/v1?netuid=64&frequency=by_hour&page=1&order=block_number_desc
Authorization: username:password
Accept: application/json

Response:
[
  {
    "netuid": 64,
    "block_number": 5816712,
    "timestamp": "2025-06-26T10:30:00.000Z",
    "price": "0.025",
    "emission_rate": 1250.5,
    "total_stake": 125000.75,
    "validator_count": 256,
    "activity_score": 85.2
  }
]
```

#### 3. Claude AI Integration
```javascript
// Internal ScoreAgent integration
const response = await this.claude.messages.create({
  model: "claude-3-sonnet-20240229",
  max_tokens: 300,
  messages: [{ 
    role: "user", 
    content: `Analyze subnet ${subnetId} performance: ${JSON.stringify(scoreData)}` 
  }]
});
```

#### 4. Telegram Bot Webhook
```http
POST /webhook/telegram
Content-Type: application/json

Request Body:
{
  "update_id": 123456789,
  "message": {
    "message_id": 1234,
    "from": { "id": 987654321, "username": "john_doe" },
    "chat": { "id": -1001234567890, "type": "private" },
    "date": 1703606400,
    "text": "/score subnet 1"
  }
}

Response:
{
  "method": "sendMessage",
  "chat_id": -1001234567890,
  "text": "🔍 Subnet 1 Analysis:\n\n📊 Score: 87/100\n💰 Yield: 12.4%",
  "parse_mode": "HTML"
}
```

### Authentication Patterns

#### Environment-Based Authentication
```javascript
// Development Mode (Mock APIs)
const headers = {
  'Content-Type': 'application/json'
  // No authentication required for mock endpoints
};

// Production Mode (Real APIs)
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${IONET_API_KEY}`,        // io.net
  'Authorization': `${USERNAME}:${PASSWORD}`,        // TaoStats
  'x-api-key': ANTHROPIC_API_KEY                     // Claude (handled by SDK)
};
```

#### API Key Management
```javascript
// Environment Variables (.env)
VITE_IONET_API_KEY=io-v1-your-key-here
VITE_TAOSTATS_USERNAME=your-username
VITE_TAOSTATS_PASSWORD=your-password
ANTHROPIC_API_KEY=sk-ant-your-key-here
TELEGRAM_BOT_TOKEN=your-bot-token-here
```

### Error Handling Patterns

#### Standard Error Response Format
```json
{
  "error": {
    "code": "SUBNET_NOT_FOUND" | "API_RATE_LIMIT" | "INVALID_REQUEST" | "SCORING_ERROR",
    "message": "Human readable error message",
    "details": "Additional technical details if available",
    "timestamp": "2025-06-26T10:30:00Z"
  }
}
```

#### HTTP Status Code Patterns
```javascript
// Success Responses
200 OK              // Successful operation
201 Created         // Resource created successfully

// Client Errors
400 Bad Request     // Invalid request parameters
401 Unauthorized    // Missing or invalid API key
404 Not Found       // Subnet or resource doesn't exist
422 Unprocessable   // Valid request but business logic error

// Server Errors
500 Internal Error  // Server-side error
502 Bad Gateway     // External API failure
503 Service Unavail // Temporary service issues
504 Gateway Timeout // External API timeout
```

#### Error Propagation Chain
```
External API Error (503) → 
ScoreAgent Error Handler → 
Backend Error Response (500) → 
API Client Error Handler → 
Custom Hook Error State → 
Component Error Display
```

### Request/Response Validation

#### Frontend Validation
```javascript
// Custom Hook Parameter Validation
const validateScoreRequest = (subnetId, metrics) => {
  if (!subnetId || typeof subnetId !== 'number') {
    throw new Error('Invalid subnet_id: must be a positive number');
  }
  
  const required = ['emission_rate', 'total_stake', 'validator_count'];
  const missing = required.filter(field => !(field in metrics));
  
  if (missing.length > 0) {
    throw new Error(`Missing required metrics: ${missing.join(', ')}`);
  }
};
```

#### Backend Validation
```javascript
// ScoreAgent Metrics Validation
validateMetrics(metrics) {
  const required = ['emission_rate', 'total_stake', 'validator_count', 'activity_score'];
  const missing = required.filter(field => !(field in metrics) || metrics[field] == null);
  
  if (missing.length > 0) {
    throw new Error(`Missing required metrics: ${missing.join(', ')}`);
  }
  
  // Validate numeric values
  const numeric = ['emission_rate', 'total_stake', 'validator_count', 'activity_score'];
  for (const field of numeric) {
    if (typeof metrics[field] !== 'number' || metrics[field] < 0) {
      throw new Error(`Invalid ${field}: must be a positive number`);
    }
  }
}
```

---

*This completes Task 2: API Contracts Documentation. Comprehensive endpoint inventory with schemas, authentication patterns, and error handling documentation has been added to provide complete API reference for all system integrations.*

---

## Environment Configuration

### Environment Variables Overview

Subnet Scout uses a comprehensive environment configuration system that supports seamless switching between development (mock) and production (real API) modes.

#### Primary Configuration File
**File:** `src/config/env.js`

```javascript
export const ENV_CONFIG = {
  // API Mode Configuration
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true' || true,
  
  // API Endpoints
  MOCK_API_URL: import.meta.env.VITE_MOCK_API_URL || 'http://localhost:3001',
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  
  // External API Keys
  IONET_API_KEY: import.meta.env.VITE_IONET_API_KEY,
  TAOSTATS_USERNAME: import.meta.env.VITE_TAOSTATS_USERNAME,
  TAOSTATS_PASSWORD: import.meta.env.VITE_TAOSTATS_PASSWORD,
  
  // Development Settings
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  DEV_MODE: import.meta.env.NODE_ENV === 'development',
  
  // Feature Flags
  ENABLE_DEBUG_LOGS: import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true' || false,
  ENABLE_ERROR_SIMULATION: import.meta.env.VITE_ENABLE_ERROR_SIMULATION === 'true' || false,
};
```

### Environment Variables Reference

#### Required Environment Variables

**`.env` File Template:**
```bash
# ===========================================
# SUBNET SCOUT ENVIRONMENT CONFIGURATION
# ===========================================

# ============= API MODE CONTROL =============
# Set to 'true' for development, 'false' for production
VITE_USE_MOCK_API=true

# ============= SERVER ENDPOINTS =============
# Mock server for development
VITE_MOCK_API_URL=http://localhost:3001
MOCK_SERVER_PORT=3001

# Backend server
VITE_BACKEND_URL=http://localhost:8080

# Frontend development server  
VITE_FRONTEND_URL=http://localhost:5173

# ============= EXTERNAL API KEYS =============
# io.net GPU Agents API
VITE_IONET_API_KEY=io-v1-your-key-here

# TaoStats Subnet Data API
VITE_TAOSTATS_USERNAME=your-username
VITE_TAOSTATS_PASSWORD=your-password

# Claude AI (Backend only - not prefixed with VITE_)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Telegram Bot (Backend only)
TELEGRAM_BOT_TOKEN=your-bot-token-here

# ============= DEVELOPMENT FLAGS =============
# Enable debug logging
VITE_ENABLE_DEBUG_LOGS=true

# Enable error simulation for testing
VITE_ENABLE_ERROR_SIMULATION=false

# Node environment
NODE_ENV=development
```

#### Environment Variable Categories

**1. API Mode Control**
- `VITE_USE_MOCK_API` - Master switch for mock vs real APIs
- Controls routing in `apiClient.js`

**2. Server Configuration**
- `VITE_MOCK_API_URL` - Mock server endpoint
- `VITE_BACKEND_URL` - Express backend endpoint
- `MOCK_SERVER_PORT` - Port for mock server

**3. External API Credentials**
- `VITE_IONET_API_KEY` - io.net authentication
- `VITE_TAOSTATS_USERNAME/PASSWORD` - TaoStats authentication
- `ANTHROPIC_API_KEY` - Claude AI (backend only)
- `TELEGRAM_BOT_TOKEN` - Telegram bot (backend only)

**4. Development Features**
- `VITE_ENABLE_DEBUG_LOGS` - Console logging control
- `VITE_ENABLE_ERROR_SIMULATION` - Error testing features
- `NODE_ENV` - Environment detection

### Mock vs Real API Switching

#### Development Mode (Mock APIs)
```javascript
// Configuration
VITE_USE_MOCK_API=true

// API Client Behavior
const url = this.useMock 
  ? `${MOCK_BASE_URL}/api/score`           // → http://localhost:3001/api/score
  : `${BACKEND_BASE_URL}/api/score`;       // Ignored in mock mode

// Authentication
const headers = {
  'Content-Type': 'application/json'
  // No authentication required for mock endpoints
};

// Data Source
Mock Server (localhost:3001) → Generates realistic test data
```

#### Production Mode (Real APIs)
```javascript
// Configuration
VITE_USE_MOCK_API=false

// API Client Behavior
const url = this.useMock 
  ? `${MOCK_BASE_URL}/api/score`           // Ignored in real mode  
  : `${BACKEND_BASE_URL}/api/score`;       // → http://localhost:8080/api/score

// Authentication
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${IONET_API_KEY}`,        // Real API key
  'Authorization': `${USERNAME}:${PASSWORD}`,        // Real credentials
};

// Data Source
Backend Server → External APIs (io.net, TaoStats, Claude)
```

### Configuration Management

#### Environment Detection Logic
```javascript
// Automatic environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const useMockApis = process.env.VITE_USE_MOCK_API === 'true';

// Environment validation
export const validateEnvironment = () => {
  const warnings = [];
  const errors = [];

  // Production without API keys
  if (!useMockApis && isProduction) {
    if (!process.env.VITE_IONET_API_KEY) {
      errors.push('VITE_IONET_API_KEY required in production');
    }
  }

  // Mock APIs in production (warning)
  if (useMockApis && isProduction) {
    warnings.push('Using mock APIs in production');
  }

  return { warnings, errors };
};
```

#### Runtime Environment Information
```javascript
// Get current environment status
export const getEnvironmentInfo = () => {
  return {
    nodeEnv: ENV_CONFIG.NODE_ENV,
    apiMode: ENV_CONFIG.USE_MOCK_API ? 'mock' : 'real',
    mockApiUrl: ENV_CONFIG.MOCK_API_URL,
    backendUrl: ENV_CONFIG.BACKEND_URL,
    hasIoNetKey: !!ENV_CONFIG.IONET_API_KEY,
    hasTaoStatsCredentials: !!(ENV_CONFIG.TAOSTATS_USERNAME && ENV_CONFIG.TAOSTATS_PASSWORD),
    debugEnabled: ENV_CONFIG.ENABLE_DEBUG_LOGS,
    errorSimulationEnabled: ENV_CONFIG.ENABLE_ERROR_SIMULATION
  };
};
```

### Deployment Patterns

#### Development Deployment
```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with VITE_USE_MOCK_API=true

# 3. Start mock server
npm run mock-server

# 4. Start backend (separate terminal)
npm run server

# 5. Start frontend (separate terminal) 
npm run dev

# All services running:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:8080  
# - Mock Server: http://localhost:3001
```

#### Production Deployment
```bash
# 1. Environment setup
export VITE_USE_MOCK_API=false
export VITE_IONET_API_KEY=your-real-key
export VITE_TAOSTATS_USERNAME=your-username
export VITE_TAOSTATS_PASSWORD=your-password
export ANTHROPIC_API_KEY=your-claude-key

# 2. Build frontend
npm run build

# 3. Start backend only
npm run start

# Production services:
# - Backend: Configured port (typically 8080)
# - Frontend: Static files served by backend or CDN
# - No mock server needed
```

#### Docker Deployment
```dockerfile
# Dockerfile.production
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Environment variables set via Docker
ENV VITE_USE_MOCK_API=false
ENV NODE_ENV=production

EXPOSE 8080
CMD ["npm", "run", "start"]
```

### Configuration Troubleshooting Guide

#### Common Issues and Solutions

**1. "API Client initialized - Using MOCK APIs" in Production**
```bash
# Problem: Mock APIs enabled in production
# Solution: Check environment variable
echo $VITE_USE_MOCK_API  # Should be 'false' or unset

# Fix:
export VITE_USE_MOCK_API=false
# OR remove from .env file entirely
```

**2. "Network connection failed" Errors**
```bash
# Problem: Services not running or wrong URLs
# Check service status:
curl http://localhost:3001/health  # Mock server
curl http://localhost:8080/health  # Backend server

# Check environment URLs:
echo $VITE_MOCK_API_URL    # Should match running mock server
echo $VITE_BACKEND_URL     # Should match running backend
```

**3. "Invalid authentication credentials" Errors**
```bash
# Problem: Missing or incorrect API keys
# Check API keys are set:
echo $VITE_IONET_API_KEY          # Should start with 'io-v1-'
echo $VITE_TAOSTATS_USERNAME      # Should be your username
echo $ANTHROPIC_API_KEY           # Should start with 'sk-ant-'

# Verify API keys work:
curl -H "Authorization: Bearer $VITE_IONET_API_KEY" https://api.io.net/v1/agents
```

**4. "Frontend showing old data" Issues**
```bash
# Problem: Environment changes not reflected
# Solution: Clear and restart all services

# 1. Stop all processes (Ctrl+C)
# 2. Clear caches
rm -rf node_modules/.cache
rm -rf .vite

# 3. Restart in correct order
npm run mock-server    # Terminal 1 (if using mocks)
npm run server         # Terminal 2  
npm run dev           # Terminal 3
```

#### Environment Validation Commands

**Check Environment Status:**
```javascript
// Run in browser console or Node.js
import { getEnvironmentInfo, validateEnvironment } from './src/config/env.js';

// Get current configuration
console.log('Environment Info:', getEnvironmentInfo());

// Validate configuration
const { warnings, errors } = validateEnvironment();
console.log('Warnings:', warnings);
console.log('Errors:', errors);
```

**API Connection Testing:**
```bash
# Test mock server
curl http://localhost:3001/health

# Test backend server  
curl http://localhost:8080/health

# Test API client mode
curl http://localhost:5173  # Should show React app
```

#### Debug Mode Configuration

**Enable Comprehensive Logging:**
```bash
# Set in .env file
VITE_ENABLE_DEBUG_LOGS=true
NODE_ENV=development

# Will enable:
# - API request/response logging
# - Environment configuration logging  
# - Error details in console
# - Performance timing logs
```

**Debug Information Available:**
```javascript
// Console outputs when debug enabled:
🔧 API Client initialized - Using MOCK APIs
📡 API Request: GET http://localhost:3001/api/agents
✅ API Response: /api/agents - Success
⚠️  Environment Warning: Using mock APIs in production
```

### Environment Security Best Practices

#### Development Security
- ✅ Mock server only accessible locally
- ✅ Debug logs disabled in production builds
- ✅ API keys properly prefixed with `VITE_` for frontend
- ✅ Backend API keys (Claude, Telegram) not exposed to frontend

#### Production Security
- ✅ Environment variable validation before startup
- ✅ API keys stored in secure environment variables
- ✅ No hardcoded credentials in source code
- ✅ HTTPS enforcement for external API calls
- ✅ Error messages don't expose sensitive information

---

*This completes Task 3: Environment Configuration Guide. Comprehensive documentation of environment variables, mock/real API switching, deployment patterns, and troubleshooting guide has been added to ensure smooth development and production operations.*

---

## Integration Patterns

### React Hooks Architecture

Subnet Scout uses a sophisticated custom hooks system that provides clean abstraction for API communication, state management, and component integration. The hooks follow React best practices and provide reusable logic across components.

#### 1. Primary API Hook: `useApi()`

**Purpose:** Generic API wrapper providing centralized loading states, error handling, and API mode management.

**Usage Pattern:**
```javascript
import { useApi } from '../hooks/useApi.js';

const MyComponent = () => {
  const { 
    loading, 
    error, 
    apiMode,
    getAgentsList, 
    calculateScore, 
    toggleApiMode, 
    clearError 
  } = useApi();

  const handleFetchData = async () => {
    try {
      const data = await getAgentsList(1, 20);
      // Handle success
    } catch (err) {
      // Error already set in hook state
      console.error('Fetch failed:', err);
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <button onClick={handleFetchData}>Fetch Data</button>
      <button onClick={toggleApiMode}>
        Switch to {apiMode === 'mock' ? 'Real' : 'Mock'}
      </button>
    </div>
  );
};
```

**State Management:**
```javascript
// Internal hook state
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [apiMode, setApiMode] = useState(apiClient.getCurrentMode());

// Generic API call wrapper with state management
const apiCall = useCallback(async (apiFunction, ...args) => {
  setLoading(true);
  setError(null);
  
  try {
    const result = await apiFunction(...args);
    setLoading(false);
    return result;
  } catch (err) {
    setError(err.message);
    setLoading(false);
    throw err;
  }
}, []);
```

#### 2. Specialized Data Hook: `useSubnetAgents()`

**Purpose:** Manages subnet agents data with pagination, statistics, and auto-fetching capabilities.

**Usage Pattern:**
```javascript
import { useSubnetAgents } from '../hooks/useApi.js';

const AgentsList = () => {
  const { 
    agents, 
    pagination, 
    stats, 
    loading, 
    error, 
    fetchAgents, 
    refreshAgents, 
    changePage,
    apiMode 
  } = useSubnetAgents(true); // autoFetch = true

  return (
    <div>
      {/* Stats Display */}
      <div>
        <p>Healthy: {stats.healthy_count}</p>
        <p>Average Score: {stats.average_score}</p>
      </div>

      {/* Agents Grid */}
      <div className="grid">
        {agents.map(agent => (
          <SubnetCard key={agent.subnet_id} agent={agent} />
        ))}
      </div>

      {/* Pagination */}
      <div>
        <button 
          onClick={() => changePage(pagination.page - 1)}
          disabled={pagination.page <= 1}
        >
          Previous
        </button>
        <span>Page {pagination.page} of {pagination.total_pages}</span>
        <button 
          onClick={() => changePage(pagination.page + 1)}
          disabled={pagination.page >= pagination.total_pages}
        >
          Next
        </button>
      </div>

      {/* Manual Refresh */}
      <button onClick={refreshAgents} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
};
```

**Advanced State Management:**
```javascript
// Multi-state management pattern
const [agents, setAgents] = useState([]);
const [pagination, setPagination] = useState({
  page: 1,
  limit: 20,
  total_pages: 1,
  total_count: 0
});
const [stats, setStats] = useState({
  healthy_count: 0,
  average_score: 0
});

// Auto-fetch with dependency management
useEffect(() => {
  if (autoFetch) {
    fetchAgents();
  }
}, [autoFetch, fetchAgents, apiMode]); // Re-fetch when API mode changes
```

#### 3. Individual Scoring Hook: `useSubnetScore()`

**Purpose:** Manages individual subnet scoring with automatic data fetching and score calculation.

**Usage Pattern:**
```javascript
import { useSubnetScore } from '../hooks/useApi.js';

const SubnetScoreCard = ({ subnetId }) => {
  const { score, loading, error, fetchScore, refetch } = useSubnetScore(subnetId);

  return (
    <div>
      {loading && <div>Calculating score...</div>}
      {error && <div>Score calculation failed: {error}</div>}
      {score && (
        <div>
          <h3>Subnet {score.subnet_id} Score</h3>
          <div className="score-display">
            <div className="overall-score">{score.overall_score}/100</div>
            <div className="breakdown">
              <div>Yield: {score.breakdown.yield_score}</div>
              <div>Activity: {score.breakdown.activity_score}</div>
              <div>Credibility: {score.breakdown.credibility_score}</div>
            </div>
            <div className="metrics">
              <p>Current Yield: {score.metrics.current_yield}%</p>
              <p>Risk Level: {score.metrics.risk_level}</p>
            </div>
            <div className="ai-summary">
              {score.ai_summary}
            </div>
          </div>
          <button onClick={refetch}>Recalculate</button>
        </div>
      )}
    </div>
  );
};
```

**Data Pipeline Pattern:**
```javascript
// Complex data fetching with multiple API calls
const fetchScore = useCallback(async (timeframe = '24h') => {
  if (!subnetId) return;

  try {
    // Step 1: Get subnet data from TaoStats
    const subnetData = await getTaoStatsData(subnetId, { limit: 1 });
    
    if (subnetData && subnetData.length > 0) {
      const data = subnetData[0];
      
      // Step 2: Transform data for scoring
      const metrics = {
        emission_rate: data.emission_rate,
        total_stake: data.total_stake,
        validator_count: data.validator_count,
        activity_score: data.activity_score,
        price_history: [data.price]
      };

      // Step 3: Calculate score using ScoreAgent
      const scoreData = await calculateScore(subnetId, metrics, timeframe);
      setScore(scoreData);
      return scoreData;
    }
  } catch (err) {
    console.error('Failed to fetch subnet score:', err);
    setScore(null);
  }
}, [subnetId, calculateScore, getTaoStatsData]);
```

#### 4. Health Monitoring Hook: `useApiHealth()`

**Purpose:** Provides real-time API health monitoring with periodic checks and status tracking.

**Usage Pattern:**
```javascript
import { useApiHealth } from '../hooks/useApi.js';

const SystemStatus = () => {
  const { 
    health, 
    lastCheck, 
    loading, 
    error, 
    checkHealth, 
    isHealthy 
  } = useApiHealth();

  return (
    <div className={`status-bar ${isHealthy ? 'healthy' : 'unhealthy'}`}>
      <div className="status-indicator">
        <div className={`dot ${isHealthy ? 'green' : 'red'}`}></div>
        <span>API Status: {isHealthy ? 'Healthy' : 'Offline'}</span>
      </div>
      
      {health && (
        <div className="health-details">
          <span>Uptime: {Math.floor(health.uptime)}s</span>
          <span>Environment: {health.environment}</span>
          <span>Last Check: {lastCheck?.toLocaleTimeString()}</span>
        </div>
      )}
      
      <button onClick={checkHealth} disabled={loading}>
        {loading ? 'Checking...' : 'Check Now'}
      </button>
    </div>
  );
};
```

**Periodic Monitoring Pattern:**
```javascript
// Automatic health checks with cleanup
useEffect(() => {
  checkHealth();
  // Set up periodic health checks every 30 seconds
  const interval = setInterval(checkHealth, 30000);
  return () => clearInterval(interval);
}, [checkHealth, apiMode]); // Re-check when API mode changes
```

### Component Integration Patterns

#### 1. Pure Presentation Components

**Pattern:** Components that receive data via props and communicate via callback functions.

**Example: `SubnetCard.jsx`**
```javascript
const SubnetCard = ({ agent, onScoreClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="subnet-card">
      {/* Status Indicator */}
      <div className={`status ${getStatusColor(agent.status)}`}>
        {agent.status}
      </div>
      
      {/* Metrics Display */}
      <div className="metrics">
        <div className="score">{agent.score}/100</div>
        <div className="yield">{agent.yield?.toFixed(1)}%</div>
        <div className="activity">{agent.activity}</div>
        <div className="credibility">{agent.credibility}</div>
      </div>
      
      {/* Actions */}
      <button onClick={() => onScoreClick?.(agent.subnet_id)}>
        View Details
      </button>
    </div>
  );
};

// Usage in parent component
<SubnetCard 
  agent={agent} 
  onScoreClick={(subnetId) => setSelectedSubnet(subnetId)} 
/>
```

#### 2. Hook-Integrated Components

**Pattern:** Components that use custom hooks for data management and state handling.

**Example: `StatsDashboard.jsx`**
```javascript
const StatsDashboard = ({ stats, loading, apiMode, onToggleApiMode }) => {
  // Hook integration for health monitoring
  const { health, isHealthy, lastCheck } = useApiHealth();

  return (
    <div className="stats-dashboard">
      {/* API Status Bar with hook data */}
      <div className="api-status">
        <div className={`indicator ${isHealthy ? 'healthy' : 'offline'}`}>
          API Status: {isHealthy ? 'Healthy' : 'Offline'}
        </div>
        <div className="mode-info">
          Mode: {apiMode}
        </div>
        <button onClick={onToggleApiMode}>
          Switch to {apiMode === 'mock' ? 'Real' : 'Mock'}
        </button>
      </div>

      {/* Stats Grid using prop data */}
      <div className="stats-grid">
        <StatCard title="Healthy Subnets" value={stats?.healthy_count || 0} />
        <StatCard title="Average Score" value={stats?.average_score || 0} />
      </div>

      {/* Health Details using hook data */}
      {health && (
        <div className="health-details">
          <div>Uptime: {Math.floor(health.uptime || 0)}s</div>
          <div>Environment: {health.environment}</div>
          <div>Status: {health.status}</div>
        </div>
      )}
    </div>
  );
};
```

#### 3. Direct API Integration Components

**Pattern:** Components that manage their own API calls and state for specialized functionality.

**Example: `ScoreAgentDemo.jsx`**
```javascript
const ScoreAgentDemo = () => {
  // Local state management
  const [subnetId, setSubnetId] = useState(1);
  const [scoreResult, setScoreResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Hook for API mode management
  const { apiMode, toggleApiMode } = useApi();

  // Direct API integration
  const calculateScore = async () => {
    setLoading(true);
    setError(null);
    setScoreResult(null);

    try {
      const response = await fetch('http://localhost:8080/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subnet_id: subnetId,
          metrics: sampleMetrics,
          timeframe: '24h'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      setScoreResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="score-demo">
      {/* Input controls */}
      <div className="controls">
        <input 
          type="number" 
          value={subnetId} 
          onChange={(e) => setSubnetId(parseInt(e.target.value))} 
        />
        <button onClick={calculateScore} disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate Score'}
        </button>
      </div>

      {/* Error handling */}
      {error && (
        <div className="error-display">
          <h4>Calculation Error</h4>
          <p>{error}</p>
        </div>
      )}

      {/* Results display */}
      {scoreResult && (
        <div className="results">
          <div className="overall-score">{scoreResult.overall_score}/100</div>
          <div className="breakdown">
            {/* Score breakdown display */}
          </div>
          <div className="ai-summary">{scoreResult.ai_summary}</div>
        </div>
      )}
    </div>
  );
};
```

### Error Handling Patterns

#### 1. Hook-Level Error Management

**Pattern:** Centralized error handling within custom hooks with automatic state management.

```javascript
// useApi hook error handling
const apiCall = useCallback(async (apiFunction, ...args) => {
  setLoading(true);
  setError(null);
  
  try {
    const result = await apiFunction(...args);
    setLoading(false);
    return result;
  } catch (err) {
    // Centralized error handling
    setError(err.message);
    setLoading(false);
    
    // Error logging
    console.error('API call failed:', err);
    
    // Re-throw for component handling if needed
    throw err;
  }
}, []);

// Hook provides error state and clearing function
return {
  loading,
  error,
  clearError: () => setError(null),
  apiCall
};
```

#### 2. Component-Level Error Display

**Pattern:** Components handle and display errors from hooks with appropriate UI feedback.

```javascript
const MyComponent = () => {
  const { loading, error, getAgentsList, clearError } = useApi();
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const result = await getAgentsList();
      setData(result);
    } catch (err) {
      // Error already handled by hook, just log locally if needed
      console.error('Component fetch failed:', err);
    }
  };

  return (
    <div>
      {/* Error Display with Dismissal */}
      {error && (
        <div className="error-banner">
          <div className="error-content">
            <h4>Operation Failed</h4>
            <p>{error}</p>
          </div>
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}

      {/* Loading State */}
      {loading && <div className="loading-spinner">Loading...</div>}

      {/* Data Display */}
      {data && <div className="data-display">{/* Data content */}</div>}

      {/* Action Button */}
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
    </div>
  );
};
```

#### 3. Progressive Error Recovery

**Pattern:** Multiple fallback strategies and error recovery mechanisms.

```javascript
const useSubnetScore = (subnetId) => {
  const [score, setScore] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { loading, error, calculateScore, getTaoStatsData } = useApi();

  const fetchScore = useCallback(async (timeframe = '24h') => {
    if (!subnetId) return;

    try {
      // Primary data source
      const subnetData = await getTaoStatsData(subnetId, { limit: 1 });
      
      if (subnetData && subnetData.length > 0) {
        const scoreData = await calculateScore(subnetId, metrics, timeframe);
        setScore(scoreData);
        setRetryCount(0); // Reset retry count on success
        return scoreData;
      } else {
        throw new Error('No subnet data available');
      }
    } catch (err) {
      console.error('Failed to fetch subnet score:', err);
      
      // Retry logic for transient errors
      if (retryCount < 3 && err.message.includes('network')) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchScore(timeframe);
        }, 1000 * Math.pow(2, retryCount)); // Exponential backoff
      } else {
        setScore(null);
      }
    }
  }, [subnetId, calculateScore, getTaoStatsData, retryCount]);

  return {
    score,
    loading,
    error,
    fetchScore,
    retryCount,
    refetch: () => {
      setRetryCount(0);
      fetchScore();
    }
  };
};
```

### State Management Patterns

#### 1. Local Component State

**Pattern:** Simple state management within individual components using useState.

```javascript
const ScoreAgentDemo = () => {
  // Form state
  const [subnetId, setSubnetId] = useState(1);
  const [timeframe, setTimeframe] = useState('24h');
  
  // Result state
  const [scoreResult, setScoreResult] = useState(null);
  
  // UI state
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      {/* Form controls update local state */}
      <input 
        value={subnetId}
        onChange={(e) => setSubnetId(parseInt(e.target.value))}
      />
      
      {/* UI state controls display */}
      <div className={`details ${showDetails ? 'expanded' : 'collapsed'}`}>
        {/* Content */}
      </div>
    </div>
  );
};
```

#### 2. Lifted State Pattern

**Pattern:** State managed at parent level and passed down to child components.

```javascript
const App = () => {
  // Lifted state for shared data
  const [selectedSubnet, setSelectedSubnet] = useState(null);
  const [apiMode, setApiMode] = useState('mock');
  
  return (
    <div>
      {/* Parent manages state, children receive props */}
      <StatsDashboard 
        apiMode={apiMode}
        onToggleApiMode={() => setApiMode(prev => prev === 'mock' ? 'real' : 'mock')}
      />
      
      <SubnetsList 
        onSubnetSelect={setSelectedSubnet}
        selectedSubnet={selectedSubnet}
      />
      
      {selectedSubnet && (
        <SubnetDetails 
          subnetId={selectedSubnet}
          onClose={() => setSelectedSubnet(null)}
        />
      )}
    </div>
  );
};
```

#### 3. Hook-Based State Sharing

**Pattern:** Custom hooks encapsulate and share state across multiple components.

```javascript
// Shared API mode hook
const useApiMode = () => {
  const [apiMode, setApiMode] = useState(apiClient.getCurrentMode());
  
  const toggleApiMode = useCallback(() => {
    apiClient.toggleMockMode();
    setApiMode(apiClient.getCurrentMode());
  }, []);

  return { apiMode, toggleApiMode };
};

// Components using shared state
const ComponentA = () => {
  const { apiMode } = useApiMode();
  return <div>Mode: {apiMode}</div>;
};

const ComponentB = () => {
  const { apiMode } = useApiMode();
  return <div>Current API: {apiMode}</div>;
};
```

### Performance Optimization Patterns

#### 1. Memoization and Callbacks

**Pattern:** Optimize re-renders using useCallback and useMemo.

```javascript
const SubnetsList = ({ onSubnetSelect }) => {
  const { agents, loading, fetchAgents } = useSubnetAgents();
  
  // Memoize expensive calculations
  const healthyAgents = useMemo(() => 
    agents.filter(agent => agent.status === 'healthy'), 
    [agents]
  );
  
  // Memoize callback functions
  const handleAgentClick = useCallback((agentId) => {
    onSubnetSelect?.(agentId);
  }, [onSubnetSelect]);
  
  // Memoize rendered components
  const agentCards = useMemo(() => 
    agents.map(agent => (
      <SubnetCard 
        key={agent.subnet_id}
        agent={agent}
        onClick={handleAgentClick}
      />
    )), 
    [agents, handleAgentClick]
  );

  return <div className="agents-grid">{agentCards}</div>;
};
```

#### 2. Conditional Hook Execution

**Pattern:** Optimize API calls with conditional execution and dependency management.

```javascript
const useConditionalData = (subnetId, enabled = true) => {
  const [data, setData] = useState(null);
  const { fetchData, loading } = useApi();
  
  const shouldFetch = enabled && subnetId && !loading;
  
  useEffect(() => {
    if (shouldFetch) {
      fetchData(subnetId).then(setData);
    }
  }, [shouldFetch, subnetId, fetchData]);
  
  return { data, loading: loading && shouldFetch };
};

// Usage
const SubnetDetails = ({ subnetId, isVisible }) => {
  // Only fetch when component is visible
  const { data, loading } = useConditionalData(subnetId, isVisible);
  
  if (!isVisible) return null;
  
  return <div>{loading ? 'Loading...' : data?.name}</div>;
};
```

---

*This completes Task 4: Integration Patterns Documentation. Comprehensive documentation of React hooks architecture, component integration patterns, error handling strategies, and state management approaches has been added to provide complete guidance for frontend development and maintenance.*

---

## Communication Flow Examples

### End-to-End User Journey Examples

Subnet Scout provides multiple user interaction paths, each with distinct communication patterns and data flows. These examples demonstrate real-world usage scenarios with complete request/response cycles.

#### Journey 1: New User Home Page Experience

**User Story:** First-time user arrives at Home page, tests Claude integration, explores API testing, and views scoring demo.

**Communication Flow:**
```
User → Home Page → Claude Query → Backend → Claude API → Response Chain

Detailed Flow:
1. User loads Home page (/) 
   └── React Router → Home.jsx component
   └── Initial state: input="", reply=""

2. User types query and clicks "Send"
   └── handleSend() → fetch("http://localhost:8080/ping", {POST})
   └── Request body: {"input": "user query"}

3. Backend processes request
   └── pingAgent.js → /ping endpoint
   └── ScoreAgent.js → callClaude() method
   └── Anthropic API → Claude response

4. Response propagation
   └── Claude API → Backend → Frontend
   └── Response format: {"reply": "Claude's response"}
   └── UI updates: setReply(data.reply)

5. User sees result
   └── Rendered in gray background div
   └── Real-time feedback during "Sending..." state
```

**Request/Response Example:**
```javascript
// Frontend Request
const handleSend = async () => {
  setReply("Sending...");
  const res = await fetch("http://localhost:8080/ping", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: "What is Bittensor?" })
  });
  const data = await res.json();
  setReply(data.reply);
};

// Backend Processing (pingAgent.js)
app.post('/ping', async (req, res) => {
  const { input } = req.body;
  try {
    const reply = await scoreAgent.callClaude(input);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Typical Response
{
  "reply": "Bittensor is a decentralized machine learning network..."
}
```

#### Journey 2: Subnet Explorer Power User Workflow

**User Story:** Experienced user navigates to Explore page, toggles API modes, analyzes multiple subnets, and monitors real-time data.

**Communication Flow:**
```
User → Explore Page → Subnet Data → Scoring → Analytics → Monitoring

Detailed Flow:
1. User navigates to /explore
   └── React Router → Explore.jsx component
   └── useSubnetAgents(true) → auto-fetch enabled

2. Initial data loading
   └── useSubnetAgents → useApi → getAgentsList()
   └── apiClient.js → Mock/Real API determination
   └── Mock: localhost:3001/api/agents
   └── Real: TaoStats/io.net APIs

3. User toggles API mode
   └── toggleApiMode() → apiClient.toggleMockMode()
   └── useEffect dependency triggers re-fetch
   └── New data loaded from different source

4. User clicks "View Details" on subnet
   └── handleScoreClick(subnetId) → setSelectedSubnet()
   └── Triggers detailed scoring analysis
   └── Multiple API calls for comprehensive data

5. Real-time updates
   └── useApiHealth → periodic health checks (30s intervals)
   └── Auto-refresh on apiMode changes
   └── Error recovery with exponential backoff
```

**Multi-API Coordination Example:**
```javascript
// Explore.jsx component integration
const Explore = () => {
  const { 
    agents, pagination, stats, loading, error, 
    changePage, refreshAgents, apiMode 
  } = useSubnetAgents();
  
  const { toggleApiMode } = useApi();

  // Coordinated state management
  const handleToggleApiMode = () => {
    toggleApiMode();
    // Data refreshes automatically via useEffect dependency
  };

  return (
    <div>
      <StatsDashboard 
        stats={stats}
        apiMode={apiMode}
        onToggleApiMode={handleToggleApiMode}
      />
      <div className="subnet-grid">
        {agents.map(agent => (
          <SubnetCard 
            key={agent.subnet_id}
            agent={agent}
            onScoreClick={handleScoreClick}
          />
        ))}
      </div>
    </div>
  );
};
```

#### Journey 3: ScoreAgent Detailed Analysis Workflow

**User Story:** Developer uses ScoreAgent Demo to analyze specific subnet performance with AI-powered insights.

**Communication Flow:**
```
User → ScoreAgent Demo → Subnet Selection → Score Calculation → AI Analysis → Results

Detailed Flow:
1. User interacts with ScoreAgent Demo
   └── ScoreAgentDemo.jsx → form inputs
   └── Sample metrics pre-loaded for testing

2. User clicks "Calculate Score"
   └── calculateScore() → direct fetch to backend
   └── POST to /api/score with subnet_id and metrics

3. Backend orchestrates multi-step analysis
   └── ScoreAgent.js → calculateScore() method
   └── Step 1: Validate input metrics
   └── Step 2: Calculate component scores (yield, activity, credibility)
   └── Step 3: Generate AI analysis via Claude
   └── Step 4: Format comprehensive response

4. AI-powered insights generation
   └── Claude API call with subnet context
   └── AI analysis of performance metrics
   └── Risk assessment and recommendations

5. Rich response with multiple data layers
   └── Overall score, breakdown, metrics, AI summary
   └── Frontend displays comprehensive results
   └── Interactive UI for detailed exploration
```

**Comprehensive Scoring Flow:**
```javascript
// Frontend request with rich metrics
const calculateScore = async () => {
  const response = await fetch('http://localhost:8080/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subnet_id: 1,
      metrics: {
        emission_rate: 1250.5,
        total_stake: 125000.75,
        validator_count: 256,
        activity_score: 85.2,
        price_history: [0.025, 0.024, 0.026, 0.027, 0.025]
      },
      timeframe: '24h'
    })
  });
  
  const result = await response.json();
  // Complex response structure with multiple data layers
};

// Backend comprehensive analysis
const scoreData = await scoreAgent.calculateScore(subnet_id, metrics, timeframe);

// Multi-dimensional response
{
  "subnet_id": 1,
  "overall_score": 78,
  "breakdown": {
    "yield_score": 82,
    "activity_score": 75,
    "credibility_score": 77
  },
  "metrics": {
    "current_yield": 3.2,
    "yield_change_24h": 0.5,
    "activity_level": "high",
    "risk_level": "medium"
  },
  "ai_summary": "This subnet shows strong performance with above-average yield...",
  "weights": { "yield": 40, "activity": 30, "credibility": 30 }
}
```

### Request/Response Flow Diagrams

#### Standard API Request Flow

```
Frontend Component
      ↓ (useState/useEffect)
Custom Hook (useApi)
      ↓ (apiCall wrapper)
API Client (apiClient.js)
      ↓ (environment detection)
      ├── Mock Mode → Mock Server (localhost:3001)
      └── Real Mode → Production APIs
                     ├── TaoStats API
                     ├── io.net API
                     └── Backend API (localhost:8080)
                           ↓
                    ScoreAgent (scoring.js)
                           ↓
                    Claude API (Anthropic)
                           ↓
                    Response Chain (reverse path)
```

#### Error Handling Flow

```
API Request
      ↓
Error Occurs
      ↓
Hook Error Handler
      ├── setError(message)
      ├── setLoading(false)
      └── Console logging
            ↓
Component Error Display
      ├── Error UI Banner
      ├── Retry Button
      └── Fallback Content
            ↓
User Recovery Actions
      ├── Dismiss Error
      ├── Retry Request
      └── API Mode Toggle
```

### Real-World Integration Scenarios

#### Scenario 1: Production Deployment Flow

**Context:** System deployed to production with real API endpoints and monitoring.

**Integration Pattern:**
```javascript
// Environment-aware configuration
const config = {
  environment: process.env.NODE_ENV,
  apiEndpoints: {
    backend: process.env.VITE_BACKEND_URL,
    taostats: process.env.VITE_TAOSTATS_URL,
    ionet: process.env.VITE_IONET_URL
  },
  monitoring: {
    healthChecks: true,
    errorReporting: true,
    performanceTracking: true
  }
};

// Production API client setup
class ProductionApiClient extends ApiClient {
  constructor() {
    super();
    this.mode = 'real';
    this.enableHealthChecks();
    this.enableErrorReporting();
  }
  
  async makeRequest(endpoint, options) {
    const startTime = performance.now();
    
    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          'X-API-Version': '1.0',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      
      this.trackPerformance(endpoint, performance.now() - startTime);
      return response;
      
    } catch (error) {
      this.reportError(error, endpoint);
      throw error;
    }
  }
}
```

#### Scenario 2: Development Team Collaboration Flow

**Context:** Multiple developers working with shared mock data and API contracts.

**Integration Pattern:**
```javascript
// Shared mock data contracts
const mockDataContracts = {
  subnet_agents: {
    schema: {
      subnet_id: 'number',
      name: 'string',
      status: 'enum[healthy,warning,critical]',
      score: 'number[0-100]',
      yield: 'number',
      activity: 'string',
      credibility: 'string'
    },
    samples: [
      { subnet_id: 1, name: 'Text Prompting', status: 'healthy', score: 85 },
      { subnet_id: 2, name: 'Machine Translation', status: 'warning', score: 72 }
    ]
  }
};

// Development API client with contract validation
class DevelopmentApiClient extends ApiClient {
  constructor() {
    super();
    this.mode = 'mock';
    this.validateContracts = true;
  }
  
  async getAgentsList(page, limit) {
    const data = await super.getAgentsList(page, limit);
    
    if (this.validateContracts) {
      this.validateAgainstContract(data, 'subnet_agents');
    }
    
    return data;
  }
}
```

#### Scenario 3: High-Availability Monitoring Flow

**Context:** System operating with redundancy, failover, and real-time monitoring.

**Integration Pattern:**
```javascript
// Resilient API client with failover
class ResilientApiClient extends ApiClient {
  constructor() {
    super();
    this.endpoints = {
      primary: process.env.VITE_PRIMARY_API,
      secondary: process.env.VITE_SECONDARY_API,
      tertiary: process.env.VITE_TERTIARY_API
    };
    this.currentEndpoint = 'primary';
    this.failoverEnabled = true;
  }
  
  async makeRequest(path, options) {
    const endpoints = ['primary', 'secondary', 'tertiary'];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.endpoints[endpoint]}${path}`, options);
        
        if (response.ok) {
          this.currentEndpoint = endpoint;
          return response;
        }
        
      } catch (error) {
        console.warn(`Endpoint ${endpoint} failed:`, error.message);
        
        if (endpoint === 'tertiary') {
          throw new Error('All endpoints failed');
        }
      }
    }
  }
}

// Health monitoring with automatic recovery
const useSystemHealth = () => {
  const [health, setHealth] = useState({
    status: 'checking',
    endpoints: {},
    lastCheck: null
  });
  
  const checkAllEndpoints = async () => {
    const endpoints = ['primary', 'secondary', 'tertiary'];
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${process.env[`VITE_${endpoint.toUpperCase()}_API`]}/health`);
        results[endpoint] = {
          status: response.ok ? 'healthy' : 'unhealthy',
          responseTime: response.headers.get('X-Response-Time'),
          lastCheck: new Date()
        };
      } catch (error) {
        results[endpoint] = {
          status: 'error',
          error: error.message,
          lastCheck: new Date()
        };
      }
    }
    
    setHealth({
      status: Object.values(results).some(r => r.status === 'healthy') ? 'operational' : 'degraded',
      endpoints: results,
      lastCheck: new Date()
    });
  };
  
  useEffect(() => {
    checkAllEndpoints();
    const interval = setInterval(checkAllEndpoints, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);
  
  return health;
};
```

### Troubleshooting Workflows

#### Common Issue 1: API Mode Switching Problems

**Symptoms:** Data not loading after toggling between mock and real APIs.

**Diagnosis Flow:**
```javascript
// Step 1: Check API mode state
const debugApiMode = () => {
  console.log('Current API mode:', apiClient.getCurrentMode());
  console.log('Mock mode enabled:', apiClient.isMockMode());
  console.log('Environment:', process.env.NODE_ENV);
};

// Step 2: Verify endpoint connectivity
const testEndpoints = async () => {
  const endpoints = {
    mock: 'http://localhost:3001/health',
    real: 'http://localhost:8080/health'
  };
  
  for (const [mode, endpoint] of Object.entries(endpoints)) {
    try {
      const response = await fetch(endpoint);
      console.log(`${mode} endpoint:`, response.ok ? 'OK' : 'FAILED');
    } catch (error) {
      console.log(`${mode} endpoint ERROR:`, error.message);
    }
  }
};

// Step 3: Force data refresh
const forceRefresh = () => {
  // Clear cached data
  setAgents([]);
  setStats({ healthy_count: 0, average_score: 0 });
  
  // Trigger new fetch
  fetchAgents(1, 20);
};
```

**Resolution Steps:**
1. Verify both mock server (port 3001) and backend (port 8080) are running
2. Check environment URLs are correct
3. Clear browser cache and local storage
4. Use browser dev tools to inspect network requests
5. Check console for API client mode switching logs

#### Common Issue 2: Scoring Request Timeout

**Symptoms:** ScoreAgent Demo hangs on "Calculating Score..." state.

**Diagnosis Flow:**
```javascript
// Enhanced error handling with timeout
const calculateScoreWithTimeout = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  try {
    const response = await fetch('http://localhost:8080/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scoreData),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timed out after 10 seconds');
    }
    
    throw error;
  }
};
```

**Resolution Steps:**
1. Check Claude API key is valid and has credits
2. Verify backend server is running and responding
3. Test with simpler scoring requests first
4. Check network connectivity to Anthropic API
5. Review backend logs for Claude API errors

#### Common Issue 3: React Hook Dependency Issues

**Symptoms:** Components not re-rendering when data changes, infinite re-render loops.

**Diagnosis Flow:**
```javascript
// Debug hook dependencies
const useDebugHook = (hookName, dependencies) => {
  const previousDeps = useRef();
  
  useEffect(() => {
    if (previousDeps.current) {
      const changedDeps = dependencies.reduce((acc, dep, index) => {
        if (dep !== previousDeps.current[index]) {
          acc.push({
            index,
            previous: previousDeps.current[index],
            current: dep
          });
        }
        return acc;
      }, []);
      
      if (changedDeps.length > 0) {
        console.log(`${hookName} dependencies changed:`, changedDeps);
      }
    }
    
    previousDeps.current = dependencies;
  });
};

// Usage in custom hooks
const useSubnetAgents = (autoFetch = true) => {
  // ... existing code ...
  
  useDebugHook('useSubnetAgents', [autoFetch, fetchAgents, apiMode]);
  
  useEffect(() => {
    if (autoFetch) {
      fetchAgents();
    }
  }, [autoFetch, fetchAgents, apiMode]);
  
  // ... rest of hook
};
```

**Resolution Steps:**
1. Use React DevTools Profiler to identify re-render causes
2. Wrap functions in useCallback with proper dependencies
3. Memoize expensive calculations with useMemo
4. Avoid creating objects/arrays in render methods
5. Use dependency array debug logging to track changes

#### Common Issue 4: Environment Configuration Conflicts

**Symptoms:** Different behavior between development and production environments.

**Diagnosis Flow:**
```javascript
// Environment validation utility
const validateEnvironment = () => {
  const requiredVars = [
    'VITE_BACKEND_URL',
    'VITE_ANTHROPIC_API_KEY',
    'VITE_TAOSTATS_API_KEY',
    'VITE_IONET_API_KEY'
  ];
  
  const missing = requiredVars.filter(key => !process.env[key]);
  const present = requiredVars.filter(key => process.env[key]);
  
  console.log('Environment validation:');
  console.log('✅ Present:', present);
  console.log('❌ Missing:', missing);
  console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
  console.log('🌐 API Mode:', apiClient.getCurrentMode());
  
  if (missing.length > 0) {
    console.warn('Missing environment variables may cause API failures');
  }
  
  return { valid: missing.length === 0, missing, present };
};

// Runtime environment debug
const debugRuntime = () => {
  console.log('Runtime configuration:');
  console.log('• Frontend URL:', window.location.origin);
  console.log('• Backend URL:', process.env.VITE_BACKEND_URL);
  console.log('• Mock Server:', process.env.VITE_MOCK_SERVER_URL);
  console.log('• API Client Mode:', apiClient.getCurrentMode());
  
  // Test connectivity
  fetch(`${process.env.VITE_BACKEND_URL}/health`)
    .then(res => console.log('✅ Backend connectivity:', res.ok))
    .catch(err => console.log('❌ Backend connectivity:', err.message));
};
```

**Resolution Steps:**
1. Run environment validation on app startup
2. Compare .env files between environments
3. Verify API endpoints are accessible from deployment environment
4. Check for URL/port conflicts
5. Validate SSL certificates for HTTPS endpoints

---

*This completes Task 5: Communication Flow Examples. Comprehensive documentation of end-to-end user journeys, request/response flows, real-world integration scenarios, and troubleshooting workflows has been added to provide complete guidance for system operations and maintenance.*

---

## 🎯 CoreComms Documentation Complete

This document provides comprehensive coverage of all communication patterns, integration flows, and operational procedures for the Subnet Scout system. The documentation is organized into five main sections:

1. **System Architecture** - Visual overview and component interactions
2. **API Contracts** - Detailed endpoint specifications and data schemas  
3. **Environment Configuration** - Setup, deployment, and troubleshooting
4. **Integration Patterns** - React hooks, state management, and error handling
5. **Communication Flow Examples** - Real-world scenarios and debugging workflows

**For Development Teams:**
- Use the API contracts section for frontend-backend coordination
- Reference integration patterns for consistent React development
- Follow environment configuration for local development setup

**For DevOps Teams:**
- Use deployment patterns for production configuration
- Reference troubleshooting workflows for issue resolution
- Monitor system health using documented patterns

**For New Team Members:**
- Start with system architecture to understand overall design
- Review communication flow examples for practical usage patterns
- Use troubleshooting section for common issue resolution

**Next Steps:**
This documentation supports the continuation of Subnet Scout development with clear communication protocols and integration standards established for the hackathon preparation phase.