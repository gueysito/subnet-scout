## 🔑 API Keys Needed

1. **io.net API**: Get from https://cloud.io.net (format: io-v1-xxxxx)
2. **Telegram Bot**: Create via @BotFather on Telegram
3. **Taostats** (optional): Request at https://taostats.io/api

## 📊 Core Metrics Tracked

| Metric             | Description           | Update Frequency |
| ------------------ | --------------------- | ---------------- |
| **Yield %**        | Staking returns       | Real-time        |
| **Activity Score** | Network usage (0-100) | 5 minutes        |
| **Credibility**    | Validator reliability | Hourly           |
| **Anomalies**      | AI-detected issues    | Instant alerts   |

## 🏗️ Architecture Overview

```
Bittensor Network → io.net GPU Cluster → AI Analysis → User Interfaces
     (118+ subnets)    (Parallel Processing)   (Intelligence API)    (Web/Bot/API)
```

## 💰 Cost Comparison

| Service   | Traditional Cloud | io.net      | Savings |
| --------- | ----------------- | ----------- | ------- |
| Compute   | $500/mo           | $50/mo      | 90%     |
| AI/ML     | $300/mo           | Included    | 100%    |
| **Total** | **$900/mo**       | **$150/mo** | **83%** |

## 📅 2-Week Sprint Plan

**Week 1: Foundation**

- Days 1-2: Setup io.net + environment
- Days 3-4: Build distributed monitoring
- Days 5-7: Integrate AI intelligence

**Week 2: Polish**

- Days 8-11: Create UI/Bot interfaces
- Days 12-14: Testing + demo prep

## 🎯 Success Criteria

- ✅ Monitor all 118+ subnets in <60 seconds
- ✅ 85%+ anomaly detection accuracy
- ✅ 99.9% uptime with redundancy
- ✅ 100+ active users during hackathon

## 🚨 Key Differentiators

1. **Only solution monitoring ALL subnets** (not just top ones)
2. **Predictive analytics** (not just current state)
3. **Conversational AI interface** for subnet queries
4. **Proven 90% cost savings** with distributed compute

## 📝 Quick Troubleshooting

| Issue            | Solution                                           |
| ---------------- | -------------------------------------------------- |
| API rate limits  | Implement caching + rate limiting                  |
| Memory errors    | Configure Ray: `ray.init(object_store_memory=2GB)` |
| Slow performance | Use batch processing (10 subnets/batch)            |

## 🔗 Important Links

- **io.net Dashboard**: https://cloud.io.net
- **Docs**: https://docs.io.net
- **Bittensor**: https://taostats.io
- **Support Discord**: [To be added]

## 💡 Remember

**Focus on demonstrating**:

1. io.net's massive parallel processing power
   traditional cloud
2. AI-powered insights that add real value
3. Solving a real problem for the Bittensor community

---

**🏆 Hackathon Goal**: Build a production-ready subnet intelligence platform that showcases io.net's unique capabilities while providing immediate value to Bittensor validators and investors.# 🔍 Subnet Scout Agent - Quick Reference Guide
_Updated July 4, 2025 - Real Live Data Integration Complete_

## 🎯 Project Overview

**io.net Intelligence-powered Bittensor subnet monitoring system** leveraging io.net's distributed GPU network to track 118+ subnets in real-time with **REAL LIVE DATA ONLY** and 83% cost savings vs traditional cloud.

**Critical Note**: This project is 95% io.net Intelligence Platform with only 5% legacy Claude usage for basic summaries.

### 🚀 Key Features

- **Real-time monitoring** of ALL Bittensor subnets (<1 min latency)
- **AI-powered insights** using io.net Intelligence Platform (95%)
- **Predictive analytics** with 24-48 hour forecasting
- **Multi-channel delivery**: Web dashboard + Telegram bot + API
- **83% cost savings** ($150/mo vs $900/mo on AWS)

## 🛠️ Tech Stack

| Component       | Technology                   | Purpose                         |
| --------------- | ---------------------------- | ------------------------------- |
| **Compute**     | io.net GPU Cloud             | Distributed parallel processing |
| **AI (95%)**    | io.net Intelligence Platform | All advanced AI features        |
| **AI Models**   | Llama-3.3-70B, DeepSeek-R1   | Specialized analysis tasks      |
| **Legacy (5%)** | Claude API                   | Basic summaries only            |
| **Backend**     | Python + Ray.io              | Orchestration & scaling         |
| **Data**        | PostgreSQL + Redis           | Storage & caching               |
| **Frontend**    | Streamlit + Telegram         | User interfaces                 |

## 📋 Essential Commands

```bash
# Quick Setup
git clone [repo] && cd subnet-scout-agent
pip install -r requirements.txt
cp .env.example .env  # Add your API keys

# Run Everything
python src/main.py            # Start monitoring
streamlit run streamlit_app.py # Web dashboard
python telegram_bot.py         # Telegram bot

# Deploy
docker build -t subnet-scout . && docker run -d subnet-scout
```

## 🔑 API Keys Needed

1. **io.net API**: Get
