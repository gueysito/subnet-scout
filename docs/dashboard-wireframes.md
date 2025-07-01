# Subnet Scout Live Dashboard Wireframes

## Overview

These wireframes define the user interface for the Subnet Scout live dashboard, designed around our agent profile data structure and optimized for monitoring Bittensor subnet performance.

## Design Principles

- **Data-Driven**: All components built around the agent profile schema
- **Performance-Focused**: Highlight key metrics (scores, yields, risk levels)
- **AI-Enhanced**: Prominently display Claude AI insights and recommendations
- **Real-Time**: Show live data with clear timestamps and freshness indicators
- **Responsive**: Mobile-first design with desktop enhancements

---

## 1. Overview Dashboard (Home Page)

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Header: [Logo] Subnet Scout    [Search] [Alerts] [Profile] │
├─────────────────────────────────────────────────────────────┤
│ Hero Stats Row                                              │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │ Network │ │ Active  │ │ Avg     │ │ Total   │           │
│ │ Health  │ │ Subnets │ │ Score   │ │ Stake   │           │
│ │   95%   │ │   118   │ │   67    │ │ 2.4M τ  │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│ Performance Overview (2/3 width) │ Quick Actions (1/3)    │
│ ┌─────────────────────────────────┐ │ ┌─────────────────┐ │
│ │ Top Performers Chart            │ │ │ • Add to Watch  │ │
│ │   📈 Score Distribution         │ │ │ • Export Data   │ │
│ │   🎯 Recommendations Breakdown  │ │ │ • API Status    │ │
│ │   ⚠️  Risk Level Overview       │ │ │ • Settings      │ │
│ └─────────────────────────────────┘ │ └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Top Performers Section                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🏆 Elite Subnets (Score 85+)                           │ │
│ │ [SubnetCard] [SubnetCard] [SubnetCard] [View All →]    │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Alerts & Notifications                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⚠️  2 Critical Alerts • 5 Warnings • 3 Info            │ │
│ │ • Subnet 47: Performance critically low                │ │
│ │ • Subnet 23: Validator count below threshold           │ │
│ │ • Market: 15% yield increase detected across network   │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Recent AI Insights                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🤖 Latest Claude Analysis                               │ │
│ │ "Subnet 1 shows exceptional stability with..."         │ │
│ │ "Market conditions favor high-activity subnets..."     │ │
│ │ [View All Insights →]                                  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

#### Hero Stats Cards
```jsx
<StatCard>
  <Icon>💚</Icon>
  <Label>Network Health</Label>
  <Value>95%</Value>
  <Trend>+2% vs yesterday</Trend>
  <Status>healthy</Status>
</StatCard>
```

#### Performance Chart
- **Score Distribution**: Histogram showing subnet performance ranges
- **Recommendation Breakdown**: Pie chart (Strong Buy, Buy, Hold, Caution, Avoid)
- **Risk Level Overview**: Bar chart showing low/medium/high/critical risk distribution

#### Top Performers Grid
- Horizontal scroll of `SubnetCard` components
- Filter: Score 85+ only
- Show max 6 cards with "View All" link

---

## 2. Subnet Explorer (Browse/Search Page)

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Header: [Logo] Subnet Scout    [Search] [Alerts] [Profile] │
├─────────────────────────────────────────────────────────────┤
│ Page Title: Explore Subnets                                │
│ Filters & Search                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Search: [_______________] 🔍                            │ │
│ │ Filters: [Type ▼] [Score Range ▼] [Status ▼] [AI Rec ▼] │ │
│ │ Sort: [Score ▼] • Show: [24 per page ▼] • Total: 118   │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Results Grid                                                │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│ │ SubnetCard  │ │ SubnetCard  │ │ SubnetCard  │           │
│ │ #1 Text     │ │ #2 Machine  │ │ #3 Scraping │           │
│ │ Score: 87   │ │ Score: 72   │ │ Score: 45   │           │
│ │ Strong Buy  │ │ Hold        │ │ Caution     │           │
│ └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│ │ SubnetCard  │ │ SubnetCard  │ │ SubnetCard  │           │
│ │ #4 Multi    │ │ #5 OpenKai  │ │ #6 Masa     │           │
│ │ Score: 63   │ │ Score: 78   │ │ Score: 52   │           │
│ │ Hold        │ │ Buy         │ │ Hold        │           │
│ └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│ Pagination: [← Prev] [1] [2] [3] [4] [5] [Next →]         │
└─────────────────────────────────────────────────────────────┘
```

### Filter Options

#### Type Filter
- All Types
- Inference (most common)
- Training
- Data Processing
- Compute
- Storage
- Hybrid

#### Score Range Filter
- All Scores
- Elite (85-100)
- High (70-84)
- Medium (50-69)
- Low (30-49)
- Poor (0-29)

#### Status Filter
- All Status
- Healthy
- Warning
- Critical
- Offline
- Maintenance

#### AI Recommendation Filter
- All Recommendations
- Strong Buy
- Buy
- Hold
- Caution
- Avoid

### Grid Layout Options
- **Grid View**: 3-4 cards per row (default)
- **List View**: Single column with horizontal cards
- **Compact View**: Table format with key metrics only

---

## 3. Subnet Detail View

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Header: [Logo] Subnet Scout    [Search] [Alerts] [Profile] │
├─────────────────────────────────────────────────────────────┤
│ Breadcrumb: Home > Explorer > Subnet 1: Text Prompting     │
│                                                    [← Back] │
├─────────────────────────────────────────────────────────────┤
│ Subnet Header                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🎯 Subnet 1: Text Prompting               Status: 💚    │ │
│ │ Advanced text generation and prompting subnet            │ │
│ │ Score: 87/100 • Risk: Low • Recommendation: Strong Buy  │ │
│ │ [🌐 Website] [📱 GitHub] [📊 Add to Watchlist]         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Performance Dashboard (2/3 width) │ Key Metrics (1/3)     │
│ ┌─────────────────────────────────┐ │ ┌─────────────────┐ │
│ │ 📈 Performance Breakdown        │ │ │ Current Yield   │ │
│ │   Yield: 89/100                 │ │ │     12.4%       │ │
│ │   Activity: 85/100              │ │ │                 │ │
│ │   Credibility: 92/100           │ │ │ Validators      │ │
│ │                                 │ │ │     256         │ │
│ │ 📊 Historical Trends            │ │ │                 │ │
│ │   [30d Score Chart]             │ │ │ Total Stake     │ │
│ │   [Yield History]               │ │ │   125,000 τ     │ │
│ │   [Validator Count]             │ │ │                 │ │
│ └─────────────────────────────────┘ │ │ Emission Rate   │ │
│                                     │ │   1,250.5/block│ │
│                                     │ │                 │ │
│                                     │ │ Network Part.   │ │
│                                     │ │     78.3%       │ │
│                                     │ └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ AI Analysis Section                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🤖 Claude AI Analysis (Confidence: 94%)                │ │
│ │                                                         │ │
│ │ Summary:                                                │ │
│ │ "Subnet 1 demonstrates excellent performance with      │ │
│ │ consistent yields and high validator participation..."  │ │
│ │                                                         │ │
│ │ ✅ Strengths:                                          │ │
│ │ • High validator count ensures decentralization        │ │
│ │ • Stable yield generation with minimal volatility      │ │
│ │ • Active community with regular updates                │ │
│ │                                                         │ │
│ │ ⚠️ Concerns:                                           │ │
│ │ • Minor price volatility in short term                 │ │
│ │                                                         │ │
│ │ 💡 Recommendation: Strong Buy                          │ │
│ │ Last Updated: 2025-01-26 10:30 UTC                     │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Technical Details (Expandable Sections)                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔧 Raw Metrics [▼]                                     │ │
│ │   Block: 5,816,712 • Activity: 85.2 • Participation: 78.3% │
│ │                                                         │ │
│ │ ⚙️ Calculation Details [▼]                             │ │
│ │   Yield Method: APY • Activity: Weighted • Updated: 10:30 │
│ │                                                         │ │
│ │ 📡 Data Sources [▼]                                    │ │
│ │   TaoStats: ✅ Active • Claude: ✅ Active • Bittensor: ✅ │
│ │                                                         │ │
│ │ 🚨 Alerts & Monitoring [▼]                            │ │
│ │   No active alerts • Uptime: 99.2% • Response: 145ms  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

#### Performance Dashboard
- **Circular Progress Indicators**: For yield, activity, credibility scores
- **Historical Charts**: 30-day trends for key metrics
- **Real-time Updates**: Live data with timestamps

#### AI Analysis Panel
- **Confidence Score**: Visual indicator of AI analysis reliability
- **Structured Insights**: Clear separation of strengths, concerns, recommendations
- **Expandable Content**: Full analysis available on demand

#### Technical Accordion
- **Raw Metrics**: All underlying data points
- **Calculation Details**: Methodology transparency
- **Data Sources**: Real-time status of all APIs
- **Monitoring**: Alerts, uptime, performance metrics

---

## 4. Mobile Responsive Design

### Mobile Layout Adaptations

#### Home Dashboard (Mobile)
```
┌───────────────────┐
│ 🏠 Subnet Scout   │
│ [🔍] [🔔] [👤]   │
├───────────────────┤
│ Network Health    │
│      95% 💚       │
├───────────────────┤
│ Quick Stats       │
│ Subnets: 118      │
│ Avg Score: 67     │
│ Total Stake: 2.4M │
├───────────────────┤
│ 🏆 Top Performers │
│ [Card 1]          │
│ [Card 2]          │
│ [View All]        │
├───────────────────┤
│ ⚠️ Alerts (7)     │
│ [Critical Alert]  │
│ [Warning Alert]   │
│ [View All]        │
└───────────────────┘
```

#### Explorer (Mobile)
```
┌───────────────────┐
│ 🔍 Explore        │
├───────────────────┤
│ [Search Box] 🔍   │
│ [Filters Button]  │
├───────────────────┤
│ [SubnetCard]      │
│ [SubnetCard]      │
│ [SubnetCard]      │
│ [Load More]       │
└───────────────────┘
```

---

## 5. Component Library

### Core Components

#### SubnetCard (Enhanced for Dashboard)
```jsx
<SubnetCard variant="dashboard">
  <Header>
    <SubnetId>1</SubnetId>
    <Name>Text Prompting</Name>
    <Status>healthy</Status>
  </Header>
  
  <ScoreSection>
    <OverallScore>87</OverallScore>
    <ScoreBar value={87} />
    <Breakdown>
      <Score label="Yield" value={89} color="green" />
      <Score label="Activity" value={85} color="blue" />
      <Score label="Credibility" value={92} color="purple" />
    </Breakdown>
  </ScoreSection>
  
  <MetricsRow>
    <Metric label="Yield" value="12.4%" />
    <Metric label="Validators" value="256" />
    <Metric label="Risk" value="Low" color="green" />
  </MetricsRow>
  
  <AISection>
    <Recommendation>Strong Buy</Recommendation>
    <Confidence>94%</Confidence>
    <Summary truncated>Excellent performance...</Summary>
  </AISection>
  
  <Footer>
    <Timestamp>Updated 2 min ago</Timestamp>
    <Actions>
      <Button variant="ghost">Details</Button>
      <Button variant="ghost">Watch</Button>
    </Actions>
  </Footer>
</SubnetCard>
```

#### StatCard
```jsx
<StatCard>
  <Icon color="green">💚</Icon>
  <Label>Network Health</Label>
  <Value>95%</Value>
  <Trend direction="up">+2%</Trend>
  <Sublabel>vs yesterday</Sublabel>
</StatCard>
```

#### AlertBanner
```jsx
<AlertBanner severity="critical">
  <Icon>⚠️</Icon>
  <Message>Subnet 47: Performance critically low</Message>
  <Timestamp>5 min ago</Timestamp>
  <Action>View Details</Action>
</AlertBanner>
```

---

## 6. Data Flow & State Management

### Real-time Updates
- **WebSocket Connection**: Live metric updates
- **Polling Fallback**: 30-second intervals for API data
- **Optimistic Updates**: Immediate UI feedback

### State Structure
```jsx
const dashboardState = {
  overview: {
    stats: { networkHealth, activeSubnets, avgScore, totalStake },
    topPerformers: SubnetProfile[],
    alerts: Alert[],
    insights: AIInsight[]
  },
  explorer: {
    subnets: SubnetProfile[],
    filters: FilterState,
    pagination: PaginationState,
    loading: boolean
  },
  detail: {
    subnet: SubnetProfile | null,
    historicalData: HistoricalData,
    loading: boolean
  }
}
```

### Performance Optimizations
- **Virtual Scrolling**: For large subnet lists
- **Lazy Loading**: Images and non-critical data
- **Memoization**: Expensive calculations cached
- **Progressive Enhancement**: Core features first, enhancements loaded async

---

## Implementation Priority

### Phase 1: Core Dashboard (MVP)
1. ✅ Basic layout and navigation
2. ✅ SubnetCard component integration
3. ✅ Overview dashboard with stats
4. ✅ Basic explorer with filtering

### Phase 2: Enhanced Features
1. 📊 Charts and visualizations
2. 🤖 AI insights integration
3. 📱 Mobile responsive design
4. 🔔 Real-time alerts

### Phase 3: Advanced Features
1. 💾 Watchlist functionality
2. 📈 Historical data views
3. 🔄 Advanced filtering
4. 📤 Export capabilities

This wireframe system leverages our complete agent profile schema and provides a comprehensive foundation for the Subnet Scout dashboard implementation. 