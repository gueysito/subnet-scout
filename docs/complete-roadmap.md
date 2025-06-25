# 🚀 Subnet Scout Agent - Complete Hackathon Roadmap
*Your step-by-step guide to building a winning project for io.net Hackathon Q2 2025*

---

## 🎯 Project Overview & Success Strategy

**What You're Building:** An AI-powered monitoring system for all 118+ Bittensor subnets that showcases io.net's distributed computing power with 90% cost savings.

**Why You'll Win:**
1. **Scale Demo**: Monitor ALL subnets in <60 seconds (others only track top ones)
2. **AI Integration**: Use io.net's 25+ models for intelligent insights
3. **Cost Story**: Prove 90% savings vs AWS ($150/mo vs $900/mo)
4. **Real Value**: Solve actual problems for Bittensor community

---

## 📅 Phase 1: Power Prep (June 20-30)
*Goal: Eliminate ALL friction so July 1st = pure building*

### 🗓️ June 20-22: Foundation Setup

#### ✅ Environment & Accounts Setup
**Why:** Having everything ready prevents Day 1 blockers

**Tasks:**
```bash
# 1. Create and setup project
mkdir subnet-scout-agent
cd subnet-scout-agent
git init
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Create complete folder structure
mkdir -p src/{clients,core,ui,utils} 
mkdir -p config data logs tests docs
mkdir -p templates static

# 3. Create all empty files
touch src/__init__.py src/clients/__init__.py src/core/__init__.py
touch config/settings.py .env .env.example
touch requirements.txt README.md
touch prompts.md  # Your Claude Code commands
```

#### ✅ Get ALL API Keys
**Why:** API access issues = project killer

1. **io.net Account**
   - Go to https://cloud.io.net
   - Sign up → Navigate to API Keys
   - Generate key (format: `io-v1-xxxxx`)
   - Save in password manager

2. **Telegram Bot**
   - Open Telegram → Search @BotFather
   - Send `/newbot` → Choose name
   - Save token immediately

3. **Optional: Taostats**
   - Visit https://taostats.io/api
   - Request access

#### ✅ Create Core Documentation
**Why:** Clear docs = faster development + better submission

Create `README.md`:
```markdown
# 🔍 Subnet Scout Agent

AI-powered Bittensor subnet monitoring using io.net's distributed GPU network.

## 🚀 Features
- Real-time monitoring of 118+ Bittensor subnets
- AI-powered insights and anomaly detection  
- 90% cost savings vs traditional cloud
- Web dashboard + Telegram bot

## 🛠️ Tech Stack
- **Compute**: io.net GPU Cloud
- **AI**: io.net Intelligence API
- **Backend**: Python, Ray.io
- **Frontend**: Streamlit, Telegram

[Setup instructions to be added]
```

### 🗓️ June 23-24: Test Critical APIs

#### ✅ Test io.net Intelligence API
**Why:** This is your main risk - ensure it works NOW

Create `test_apis.py`:
```python
import openai
import os
from dotenv import load_dotenv

load_dotenv()

# Test io.net API
client = openai.OpenAI(
    api_key=os.getenv("IO_NET_API_KEY"),
    base_url="https://api.intelligence.io.solutions/api/v1/"
)

response = client.chat.completions.create(
    model="gpt-4-turbo",
    messages=[{"role": "user", "content": "Test connection"}],
    max_tokens=50
)

print("✅ io.net API working:", response.choices[0].message.content)
```

#### ✅ Test Bittensor Connection
**Why:** Verify you can fetch subnet data

```python
# Install: pip install bittensor
import bittensor as bt

subtensor = bt.subtensor(network='finney')
subnets = subtensor.get_all_subnet_netuids()
print(f"✅ Found {len(subnets)} active subnets")
```

#### ✅ Create Mock Data Pipeline
**Why:** Test your entire flow with fake data before real implementation

Create `mock_data.json`:
```json
{
  "subnets": [
    {
      "id": 1,
      "name": "Text Generation",
      "yield": 12.5,
      "activity": 85,
      "validators": 256,
      "credibility": 92
    }
  ]
}
```

### 🗓️ June 25-26: Design Core Logic

#### ✅ Define Scoring Algorithm
**Why:** Your scoring logic is the heart of the product

Create `docs/scoring_logic.md`:
```markdown
# Scoring Algorithm

## Composite Score (0-100)
- Yield: 40% weight (higher APY = better)
- Activity: 30% weight (more transactions = better)
- Credibility: 30% weight (uptime + consistency)

## Formula
```python
score = (yield_norm * 0.4) + (activity_norm * 0.3) + (credibility_norm * 0.3)
```

## Normalization
Each metric normalized to 0-100 scale using percentile ranking
```

#### ✅ Create Claude Code Prompts File
**Why:** Pre-written prompts = 3x faster development

Create `prompts.md`:
```markdown
# Claude Code Commands

## Day 1 - Project Setup
```
claude "Create a complete project structure for Subnet Scout Agent with:
- src/ folder with clients, core, ui subfolders
- config/settings.py with all environment variables
- requirements.txt with these packages: bittensor, openai, ray, streamlit, pandas, redis, python-telegram-bot
- .env.example file with all needed variables"
```

## Day 2 - io.net Client
```
claude "Create src/clients/io_net_client.py that:
- Connects to io.net Intelligence API using OpenAI client
- Has methods for: generate_summary(data), detect_anomalies(historical_data), predict_trends(data)
- Includes error handling and rate limiting
- Follows the technical guide implementation"
```

## Day 3 - Distributed Monitoring
```
claude "Create src/core/distributed_monitor.py using Ray that:
- Monitors all 118 Bittensor subnets in parallel
- Uses Ray actors for distributed processing
- Collects metrics: yield, activity, validator count
- Completes full scan in under 60 seconds"
```
```

### 🗓️ June 27-28: Build UI Skeleton

#### ✅ Create Streamlit Shell
**Why:** Having UI ready means you can test as you build

Create `streamlit_app.py`:
```python
import streamlit as st

st.set_page_config(page_title="Subnet Scout", layout="wide")

# Sidebar
st.sidebar.title("🔍 Subnet Scout Agent")
st.sidebar.info("Powered by io.net - 90% cheaper than AWS!")

# Main content
st.title("Bittensor Subnet Intelligence Dashboard")

# Metrics placeholders
col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric("Active Subnets", "118", "+3")
with col2:
    st.metric("Avg Yield", "12.4%", "+0.8%")
with col3:
    st.metric("Monitoring Cost", "$150/mo", "-$750 vs AWS")
with col4:
    st.metric("Update Speed", "<60 sec", "")

# Placeholder for subnet table
st.subheader("🏆 Top Performing Subnets")
st.info("Subnet data will appear here...")

# Run with: streamlit run streamlit_app.py
```

#### ✅ Test Everything Works
```bash
# Test your virtual environment
python test_apis.py  # Should connect to io.net

# Test Streamlit
streamlit run streamlit_app.py  # Should show dashboard

# Test imports
python -c "import ray; import bittensor; print('✅ All imports working')"
```

### 🗓️ June 29-30: Final Prep & Review

#### ✅ Create Integration Test
**Why:** Ensures your components will work together

Create `test_integration.py`:
```python
# Mock the entire flow
def test_full_pipeline():
    # 1. Fetch data (mock)
    data = load_mock_data()
    
    # 2. Process in parallel (mock)
    results = process_subnets(data)
    
    # 3. Generate AI summary (mock)
    summary = generate_summary(results)
    
    # 4. Display in UI (mock)
    display_results(summary)
    
    print("✅ Integration test passed!")
```

#### ✅ Pre-Build Checklist
- [ ] All accounts created and API keys saved
- [ ] Project structure complete
- [ ] All dependencies installable
- [ ] Mock data pipeline works
- [ ] UI skeleton displays
- [ ] Claude Code prompts ready
- [ ] integration test passes

---

## 🔨 Phase 2: Build Sprint (July 1-13)

### 🗓️ Week 1: Core Systems (July 1-6)

#### 📅 Monday, July 1: Foundation Day
**Goal:** Complete project structure + basic Bittensor connection

**Morning (2 hours):**
```bash
# Use your pre-written prompt
claude "Create complete project structure for Subnet Scout Agent [paste from prompts.md]"

# Implement configuration
claude "Create config/settings.py with proper environment variable handling"
```

**Afternoon (2 hours):**
```bash
# Create Bittensor client
claude "Create src/clients/bittensor_client.py that fetches data for one subnet"

# Test it works
python -c "from src.clients.bittensor_client import BittensorClient; 
          client = BittensorClient(); 
          print(client.get_subnet_data(1))"
```

#### 📅 Tuesday, July 2: io.net Integration
**Goal:** Connect io.net AI capabilities

**Morning (2 hours):**
```bash
# Implement io.net client
claude "Create src/clients/io_net_client.py following the technical guide"

# Test API connection
python test_apis.py
```

**Afternoon (2 hours):**
```bash
# Add AI features
claude "Add methods to io_net_client for: 
- Generating subnet summaries
- Detecting anomalies
- Creating daily reports"
```

#### 📅 Wednesday, July 3: Distributed Processing ⭐
**Goal:** YOUR KEY DIFFERENTIATOR - parallel monitoring

**Full Day (4 hours):**
```bash
# This is CRITICAL - your wow factor!
claude "Create src/core/distributed_monitor.py that:
- Uses Ray to monitor ALL 118 subnets in parallel
- Completes in under 60 seconds
- Shows clear performance advantage"

# Test and measure
python -c "from src.core.distributed_monitor import monitor_all;
          import time;
          start = time.time();
          results = monitor_all();
          print(f'✅ Monitored {len(results)} subnets in {time.time()-start:.1f} seconds')"
```

#### 📅 Thursday, July 4: Scoring System
**Goal:** Implement ranking logic

**Morning (2 hours):**
```bash
claude "Create src/core/scoring_engine.py that:
- Calculates composite scores (yield 40%, activity 30%, credibility 30%)
- Normalizes metrics to 0-100
- Ranks all subnets"
```

**Afternoon (2 hours):**
```bash
claude "Create src/core/alert_system.py for anomaly detection"
```

#### 📅 Friday, July 5: Connect Everything
**Goal:** Wire all components together

```bash
claude "Create src/main.py that:
- Orchestrates the monitoring cycle
- Saves results to database
- Triggers AI summaries
- Handles errors gracefully"

# Run your first full cycle!
python src/main.py
```

#### 📅 Saturday, July 6: UI Polish
**Goal:** Make it beautiful

**Morning only (2 hours):**
```bash
claude "Enhance streamlit_app.py with:
- Real-time subnet heatmap
- Cost savings calculator
- Top 3 subnet cards with AI insights"
```

#### 📅 Sunday, July 7: REST DAY 🌴

---

### 🗓️ Week 2: Polish & Ship (July 8-13)

#### 📅 Monday, July 8: Telegram Bot
**Goal:** Add second interface

```bash
claude "Create src/ui/telegram_bot.py with:
- /start command with welcome
- /top command showing top 3 subnets
- /alert subscription system"
```

#### 📅 Tuesday, July 9: Cost Comparison Widget ⭐
**Goal:** EMPHASIZE your 90% savings

```bash
claude "Add to Streamlit dashboard:
- Live cost comparison widget
- 'Savings Calculator' showing $750/month saved
- Performance metrics vs traditional cloud"
```

#### 📅 Wednesday, July 10: Demo Video Creation
**Goal:** Show your impact

**Demo Script:**
1. "Problem: Monitoring 118 Bittensor subnets is expensive and slow"
2. "Solution: io.net's distributed GPUs monitor everything in 60 seconds"
3. Show dashboard updating all subnets simultaneously
4. Highlight AI-generated insights
5. Show cost widget: "$150 vs $900 on AWS"
6. "90% cheaper, 10x faster"

**Tools:** OBS Studio or Loom (keep under 3 minutes)

#### 📅 Thursday, July 11: Documentation
**Goal:** Make it easy for judges

```bash
claude "Update README.md with:
- Clear problem/solution statement
- One-click setup instructions
- Architecture diagram
- Cost analysis section
- Link to demo video"
```

#### 📅 Friday, July 12: Testing & Polish
**Goal:** Everything works perfectly

**Morning Checklist:**
- [ ] Fresh install test on new machine
- [ ] All error cases handled
- [ ] Loading states implemented
- [ ] README has all commands
- [ ] Demo video uploaded

**Afternoon:** Light work, prepare submission

#### 📅 Saturday, July 13: Final Review
**Morning only:**
- [ ] Run through judge's checklist
- [ ] Test all features one more time
- [ ] Backup everything
- [ ] Rest after 2 PM

---

## 🏁 Phase 3: Submission (July 14)

### Submission Checklist:
1. **GitHub Repository**
   - [ ] Public repository
   - [ ] Clear README with demo GIF/video
   - [ ] One-click setup instructions
   - [ ] MIT License

2. **Hackathon Submission**
   - [ ] Project title: "Subnet Scout Agent - 90% Cheaper Bittensor Monitoring"
   - [ ] Category: Best use of io.net Intelligence
   - [ ] Emphasize: Scale (118 subnets), Speed (<60s), Savings (90%)

3. **Social Share**
   ```
   🚀 Just shipped Subnet Scout Agent for @ionet hackathon!
   
   Monitor ALL 118 #Bittensor subnets in <60 seconds
   🤖 AI-powered insights
   💰 90% cheaper than AWS
   📊 Real-time dashboard
   
   [demo video link]
   ```

---

## 💡 Daily Success Rituals

**Every Morning (10 min):**
```bash
# Check what you're building today
cat prompts.md | grep "Day X"

# Verify environment
source venv/bin/activate
python -c "import ray; import bittensor; print('✅ Ready to build!')"
```

**Every Evening (10 min):**
```bash
# Commit your work
git add .
git commit -m "Day X: [what you built]"
git push

# Plan tomorrow
echo "Tomorrow: [specific goal]" >> progress.log
```

---

## 🎯 Remember Your Winning Strategy

1. **Show SCALE**: All 118 subnets, not just top ones
2. **Show SPEED**: <60 seconds with distributed processing  
3. **Show SAVINGS**: $150 vs $900 comparison prominently
4. **Show SMARTS**: AI insights that add real value

You've got this! 🚀