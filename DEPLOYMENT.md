# 🚀 Subnet Scout Production Deployment Guide

## Architecture Overview

**Unified Production Backend**: Single zero-dependency Node.js server (`backend/server.js`) consolidating all previous backend services.

## Environment Variables

### Required for Production

```bash
# Core API Integration
IONET_API_KEY=your_ionet_api_key              # io.net AI intelligence (enhanced features)
TAOSTATS_API_USERNAME=your_taostats_username  # Bittensor subnet data
TELEGRAM_BOT_TOKEN=your_telegram_bot_token    # Multi-platform access

# Optional Enhancement
CLAUDE_API_KEY=your_claude_api_key            # Fallback AI analysis
```

### Development

```bash
NODE_ENV=development
PORT=8080
```

### Production

```bash
NODE_ENV=production
PORT=${PORT:-8080}  # Railway/Heroku will set this
```

## Deployment Platforms

### 1. Railway (Recommended)

```bash
# 1. Connect repository to Railway
# 2. Set environment variables in Railway dashboard
# 3. Deploy automatically via Git push

# Environment Variables in Railway:
IONET_API_KEY=your_key
TAOSTATS_API_USERNAME=username
TELEGRAM_BOT_TOKEN=token
NODE_ENV=production
```

**Health Check**: `GET /health`
**Deployment Command**: `npm run backend`

### 2. Heroku

```bash
# 1. Create Heroku app
heroku create subnet-scout-backend

# 2. Set environment variables
heroku config:set IONET_API_KEY=your_key
heroku config:set TAOSTATS_API_USERNAME=username
heroku config:set TELEGRAM_BOT_TOKEN=token
heroku config:set NODE_ENV=production

# 3. Deploy
git push heroku main
```

### 3. Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "run", "backend"]
```

```bash
# Build and run
docker build -t subnet-scout .
docker run -p 8080:8080 \
  -e IONET_API_KEY=your_key \
  -e TAOSTATS_API_USERNAME=username \
  -e TELEGRAM_BOT_TOKEN=token \
  -e NODE_ENV=production \
  subnet-scout
```

## Feature Matrix by Environment

### With IONET_API_KEY

✅ **Full AI Enhancement**

- Real io.net intelligence for TAO questions
- AI-generated subnet summaries
- Enhanced subnet analysis
- Smart routing between specialized models

### Without IONET_API_KEY

✅ **Honest Fallback Mode**

- Built-in TAO question processing
- Structured subnet analysis templates
- Trust score calculations
- Complete functionality with clear data limitations

## API Endpoints

### Core Endpoints

- `GET /health` - System health with io.net integration status
- `GET /api/agents` - Enhanced subnet list (78 subnets with metadata)
- `GET /api/subnet/:id/data` - Individual subnet data with trust scores
- `POST /api/tao/question` - TAO questions with io.net intelligence
- `POST /api/score/enhanced` - Enhanced scoring with AI summaries
- `GET /api/ionet/status` - io.net integration health check

### Security Features

- CORS configured for frontend integration
- Security headers (CSP, XSS protection)
- Rate limiting ready for production
- Graceful error handling and fallbacks

## Deployment Verification

### 1. Health Check

```bash
curl https://your-domain.com/health
```

Expected response:

```json
{
  "status": "healthy",
  "backend": "unified_production",
  "enhanced_database": true,
  "ionet_integration": {
    "enabled": true,
    "api_key_configured": true,
    "enhanced_ai_features": true
  }
}
```

### 2. TAO Question Test

```bash
curl -X POST https://your-domain.com/api/tao/question \
  -H "Content-Type: application/json" \
  -d '{"question": "what is subnet 8?"}'
```

### 3. Subnet Data Test

```bash
curl https://your-domain.com/api/agents?limit=5
```

## Performance Characteristics

- **Zero External Dependencies**: Only Node.js built-ins
- **Fast Startup**: < 2 seconds with 78 subnet database
- **Memory Efficient**: < 100MB RAM usage
- **Graceful Degradation**: Works with/without external APIs
- **Error Resilience**: Comprehensive fallback strategies

## Monitoring & Observability

### Key Metrics

- `/health` endpoint response time
- io.net API success rate (if configured)
- TAO question processing latency
- Enhanced scoring generation time

### Log Levels

- `✅` Success operations
- `⚠️` Warnings (missing API keys, fallbacks)
- `❌` Errors (with graceful handling)
- `🤖` AI processing events
- `📡` HTTP request/response logging

## Frontend Integration

Update frontend `ENV_CONFIG` to point to production backend:

```javascript
const ENV_CONFIG = {
  BACKEND_URL: "https://your-production-backend.com",
  // ... other config
};
```

## Architecture Benefits

### Reliability

- Single point of deployment
- Zero external service dependencies for core functionality
- Honest data representation vs fake generation
- Comprehensive error handling

### Scalability

- Stateless design
- Horizontal scaling ready
- Efficient caching strategies
- Database-free operation

### Maintainability

- Consolidated codebase
- Clear separation of enhanced vs base features
- Extensive logging and monitoring
- Production-tested error scenarios

## Migration Notes

### From Previous Architecture

- ✅ Replaces `simple-backend.js` entirely
- ✅ Replaces `pingAgent.js` entirely
- ✅ Enhanced TAO question processing (was broken)
- ✅ Honest scoring (no more fake data generation)
- ✅ Real io.net integration (vs placeholders)

### Breaking Changes

- None - fully backward compatible API
- Enhanced responses include additional metadata
- Better error handling and status codes

---

**Status**: Production Ready ✅
**Zero Dependencies**: Node.js built-ins only ✅  
**AI Enhancement**: io.net integration ✅
**Honest Fallbacks**: Complete functionality without API keys ✅
