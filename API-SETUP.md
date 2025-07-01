# API Setup Guide

## Step 1 Complete ✅

You now have a complete API contracts and mock services setup! Here's what was created:

### 📋 Files Created:
1. **`api-contracts.md`** - Complete API specifications
2. **`mock-server.js`** - Mock server implementing all contracts
3. **`src/utils/apiClient.js`** - Centralized API client with mock/real switching
4. **`test-api-contracts.js`** - Comprehensive test suite

### 🔧 Environment Variables Needed:

Add these to your `.env` file:

```bash
# API Configuration
VITE_USE_MOCK_API=true
VITE_MOCK_API_URL=http://localhost:3001
MOCK_SERVER_PORT=3001
VITE_BACKEND_URL=http://localhost:8080

# Real API Keys (when ready to switch from mock)
VITE_IONET_API_KEY=io-v1-your-key-here
VITE_TAOSTATS_USERNAME=your-username
VITE_TAOSTATS_PASSWORD=your-password
TELEGRAM_BOT_TOKEN=your-bot-token-here

# Existing
ANTHROPIC_API_KEY=your-claude-key-here
```

### 🚀 How to Run:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run mock server only:**
   ```bash
   npm run mock-server
   ```

3. **Run frontend with mock APIs:**
   ```bash
   npm run dev:mock
   ```

4. **Run everything (mock + backend + frontend):**
   ```bash
   npm run dev:full
   ```

5. **Test API contracts:**
   ```bash
   node test-api-contracts.js
   ```

### 📡 Available Mock Endpoints:

- `GET /api/ionet/agents` - Mock io.net GPU agents
- `GET /api/taostats/pool/history` - Mock subnet data
- `POST /api/score` - Mock scoring calculation
- `GET /api/agents` - Mock agents list
- `POST /webhook/telegram` - Mock Telegram webhook
- `GET /health` - Health check

### 🔄 Switching Between Mock and Real APIs:

The `apiClient` automatically switches based on `VITE_USE_MOCK_API`:
- `true` = Uses mock server on localhost:3001
- `false` = Uses real APIs with your API keys

### ✅ What This Accomplishes:

✅ **API Contracts Defined** - Clear request/response schemas
✅ **Mock Services Created** - Realistic test data with proper error handling  
✅ **Frontend/Backend Decoupling** - Teams can work in parallel
✅ **Error Scenario Testing** - 404s, 500s, auth failures, timeouts
✅ **Environment Flag Switching** - Easy dev → production transition

### 🎯 Next Steps:

Your Step 1 is complete! The mock services provide:
- Realistic subnet scoring data
- io.net agent information
- TaoStats-like pool history
- Telegram bot interactions
- Proper error responses

You can now proceed to **Step 2: Integrate Mock APIs with Frontend** with confidence that all your API contracts are solid and tested. 