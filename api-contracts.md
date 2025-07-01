# API Contracts & Schemas

## 1. io.net API Contract

### GET /v1/agents
**Purpose:** Fetch available GPU agents for distributed processing

**Request:**
```javascript
GET https://api.io.net/v1/agents
Headers: {
  "Authorization": "Bearer io-v1-xxxxx",
  "Content-Type": "application/json"
}
```

**Response Schema:**
```json
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

---

## 2. TaoStats API Contract (v1)

### GET /api/dtao/pool/history/v1
**Purpose:** Fetch subnet pool history data

**Request:**
```javascript
GET https://api.taostats.io/api/dtao/pool/history/v1?netuid=64&frequency=by_hour&block_start=5806712&block_end=5816712&page=1&order=block_number_desc
Headers: {
  "Authorization": "username:password",
  "Accept": "application/json"
}
```

**Response Schema:**
```json
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

---

## 3. Telegram Bot Webhook Contract

### POST /webhook/telegram
**Purpose:** Receive Telegram bot updates

**Request Schema:**
```json
{
  "update_id": 123456789,
  "message": {
    "message_id": 1234,
    "from": {
      "id": 987654321,
      "username": "john_doe",
      "first_name": "John"
    },
    "chat": {
      "id": -1001234567890,
      "type": "private"
    },
    "date": 1703606400,
    "text": "/score subnet 1"
  }
}
```

**Response Schema:**
```json
{
  "method": "sendMessage",
  "chat_id": -1001234567890,
  "text": "🔍 Subnet 1 Analysis:\n\n📊 Score: 87/100\n💰 Yield: 12.4%\n⚡ Activity: 85/100\n🛡️ Credibility: 92/100",
  "parse_mode": "HTML"
}
```

---

## 4. Internal Scoring API Contract

### POST /api/score
**Purpose:** Calculate subnet scoring based on multiple metrics

**Request Schema:**
```json
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
```

**Response Schema:**
```json
{
  "subnet_id": 1,
  "overall_score": 87,
  "breakdown": {
    "yield_score": 89,
    "activity_score": 85,
    "credibility_score": 92
  },
  "metrics": {
    "current_yield": 12.4,
    "yield_change_24h": 0.8,
    "activity_level": "high",
    "risk_level": "low"
  },
  "ai_summary": "Subnet 1 shows strong performance with consistent yields and high validator participation. Recent 24h trend indicates positive momentum.",
  "timestamp": "2025-06-26T10:30:00Z"
}
```

### GET /api/agents
**Purpose:** List all monitored subnet agents

**Response Schema:**
```json
{
  "agents": [
    {
      "subnet_id": 1,
      "name": "Text Prompting",
      "status": "healthy",
      "score": 87,
      "yield": 12.4,
      "activity": 85,
      "credibility": 92,
      "last_updated": "2025-06-26T10:30:00Z"
    }
  ],
  "total_count": 118,
  "healthy_count": 95,
  "average_score": 73.2
}
```

---

## 5. Error Response Schema (All APIs)

**Standard Error Format:**
```json
{
  "error": {
    "code": "SUBNET_NOT_FOUND" | "API_RATE_LIMIT" | "INVALID_REQUEST",
    "message": "Human readable error message",
    "details": "Additional technical details if available",
    "timestamp": "2025-06-26T10:30:00Z"
  }
}
```

**HTTP Status Codes:**
- 200: Success
- 400: Bad Request (invalid parameters)
- 401: Unauthorized (invalid API key)
- 404: Not Found (subnet/resource doesn't exist)
- 429: Rate Limited
- 500: Internal Server Error 