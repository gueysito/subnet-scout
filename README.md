> **Dormant security-maintenance state (2026-10-30).** This project is not being
> revived or deployed. Admin operations and direct browser provider access are
> disabled, servers default to loopback, and generated data is not tracked.
> Historical production-readiness claims below are not a current approval to host it.
> See [the security maintenance tracker](docs/plan.md#security-maintenance-2026-10-30).

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

The React and Vite frontend displays data from the raw Node.js API selected by
root start scripts and Procfile. A separate legacy Express API remains in the backend directory. The monitoring backend uses parallel processing and data from TaoStats and other integrations. AI services support scoring, analysis, and risk assessment. The Telegram bot calls the backend for subnet information and analysis.

## Getting started

Use the pinned Node.js 22.23.4 and npm 11.12.1. Python is only needed for the
legacy distributed-monitoring feature, which is not started by the checks below:

```bash
git clone https://github.com/gueysito/subnet-scout.git
cd subnet-scout
npm ci --ignore-scripts
npm run prepare:sqlite
```

No provider credentials are needed for offline maintenance checks:

```bash
npm run test:security
npm run check:client-secrets
npm run build
npm audit --audit-level=moderate
npm --prefix backend ci --ignore-scripts
npm --prefix backend audit --audit-level=moderate
```

`npm run prepare:sqlite` runs only the reviewed SQLite dependency's native setup;
other lifecycle scripts remain blocked. The alternate backend has its own lockfile.
The existing utility suite and full lint have historical failures recorded in the
[maintenance tracker](docs/plan.md#security-maintenance-2026-10-30).

`npm run backend` starts the raw Node server locally; `npm run dev` starts Vite
locally. Admin routes return 503 and legacy token verification refuses access.
Direct browser calls requiring private provider credentials are disabled. Server
provider variables stay unprefixed in private server configuration, never `VITE_*`.
Do not run bots, provider integrations or deploy this dormant project as part of
maintenance. The integrations described below are historical capabilities.

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
