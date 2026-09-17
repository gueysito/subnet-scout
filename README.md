# Subnet Scout

Subnet Scout is a real-time monitoring agent for Bittensor subnets. It processes 118+ subnets in parallel, combines network data with AI-powered scoring and risk assessment, and makes the results available through a web interface, API, and Telegram bot.

## What it does

- Monitors subnet activity and performance across the network.
- Scores subnets and assesses risk using AI-assisted analysis.
- Runs distributed monitoring jobs in parallel.
- Presents subnet data and insights in a React dashboard.
- Provides on-demand analysis and alerts through [@SubnetScoutBot](https://t.me/SubnetScoutBot).

## Performance

The project reports these benchmark results for its 118-subnet workload and estimated monthly infrastructure costs:

| Metric | Reported result | Comparison |
| --- | ---: | --- |
| Processing time | 5.37 seconds for 118 subnets | 109x faster than the sequential benchmark |
| Throughput | 22 subnets per second | Parallel monitoring |
| Monthly cost | $150 versus $900 | 83% cheaper than the cloud comparison |

Results depend on the workload, data sources, and infrastructure used.

## Architecture

The React and Vite frontend displays data from a Node.js and Express API. The monitoring backend uses parallel processing and data from TaoStats and other integrations. AI services support scoring, analysis, and risk assessment. The Telegram bot calls the backend for subnet information and analysis.

## Getting started

Install Node.js 18+ and Python 3.8+, then clone the repository and install its dependencies:

```bash
git clone https://github.com/gueysito/subnet-scout.git
cd subnet-scout
npm install
```

Copy `.env.example` to `.env` and configure the credentials for the services you intend to use, including TaoStats and the AI provider. Add `TELEGRAM_BOT_TOKEN` to run the bot. Keep `.env` private.

Run the monitoring API, frontend, and optional bot in separate terminals:

```bash
node backend/pingAgent.js
npm run dev
npm run telegram-bot
```

## API

The monitoring backend exposes these endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | Backend health |
| GET | `/api/agents` | Subnet data for the dashboard |
| GET | `/api/subnet/:id/data` | Data for one subnet |
| GET | `/api/distributed/monitor` | Run a distributed monitoring pass |
| POST | `/api/score/enhanced` | AI-assisted subnet scoring |
| GET | `/api/insights/risk/:subnetId` | Risk assessment for one subnet |

Some endpoints require authentication or are rate limited. See `backend/pingAgent.js` for request details.

## Telegram bot

[@SubnetScoutBot](https://t.me/SubnetScoutBot) supports `/top`, `/analyze`, `/compare`, `/identity`, and `/alerts`. Configure `TELEGRAM_BOT_TOKEN` and `BACKEND_URL` before running it locally.
