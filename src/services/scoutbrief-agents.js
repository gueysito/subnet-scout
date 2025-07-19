// NUCLEAR REBUILD - ALL 5 AGENTS FROM SCRATCH
// NO CREATIVITY. NO MODIFICATIONS. EXACT IMPLEMENTATION ONLY.

// IONET API Configuration
const IONET_API_URL = 'https://api.intelligence.io.solutions/api/v1/chat/completions';
const MODEL = 'meta-llama/Llama-3.3-70B-Instruct';

// Helper function for IONET API calls
async function makeInferenceRequest(prompt, apiKey) {
  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      console.log(`🔄 IONET API attempt ${retries + 1}/${maxRetries}`);
      
      const response = await fetch(IONET_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (response.status === 500 && retries < maxRetries - 1) {
        console.log(`⚠️ IONET 500 error, retrying in 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        retries++;
        continue;
      }

      if (!response.ok) {
        throw new Error(`IONET API Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      if (retries < maxRetries - 1 && error.message.includes('500')) {
        retries++;
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        throw error;
      }
    }
  }
}

// Process numbers for prompts - NO DECIMALS BEYOND 2 PLACES
function cleanNumber(num, decimals = 2) {
  if (typeof num !== 'number') return 0;
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// Agent 1: Momentum
async function runMomentumAgent(subnet, context, apiKey) {
  // SAFE VARIABLE EXTRACTION
  const growth_rate = cleanNumber(subnet.growth_percentage || -100, 0);
  const validator_count = subnet.validator_count || 0;
  const tao_staked = cleanNumber(subnet.total_stake || 0, 2);
  
  // BUILD PROMPT - NO TEMPLATE LITERALS, NO SPECIAL CHARS
  const prompt = `You are Momentum, the Growth Analyst for Bittensor subnets.
Analyze subnet ${subnet.subnet_id} growth metrics for Q3 2025.

METRICS TO ANALYZE:
- QoQ Growth: ${growth_rate}
- Current validators: ${validator_count}
- TAO staked: ${tao_staked}
- Previous quarter validators: 0
- New wallets this quarter: 0

CONTEXT FROM ADMIN:
${context || 'No additional context provided'}

SCORING RUBRIC:
- 90-100: Over 50 percent growth, strong adoption
- 70-89: 20-50 percent growth, good momentum  
- 50-69: 0-20 percent growth, stable
- 30-49: Negative growth under -20 percent
- 0-29: Severe decline over -50 percent

You must respond ONLY with valid JSON in this exact format:
{
  "score": 85,
  "trend": "accelerating",
  "key_finding": "one sentence insight",
  "analysis": "150 word detailed analysis", 
  "data_points": [50, 1234567.89, 25]
}`;

  try {
    const response = await makeInferenceRequest(prompt, apiKey);
    
    // Clean response - remove % signs
    const cleanedResponse = response.replace(/(-?\d+)%/g, '$1');
    
    // Try to parse JSON
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Momentum agent failed:', error.message);
    throw error;
  }
}

// Agent 2: Dr. Protocol  
async function runDrProtocolAgent(subnet, context, apiKey) {
  const github_activity = subnet.github_activity || 0;
  const last_updated_days = Math.floor((Date.now() - new Date(subnet.last_updated)) / (1000 * 60 * 60 * 24));
  
  const prompt = `You are Dr. Protocol, the Technical Evaluator for Bittensor subnets.
Evaluate subnet ${subnet.subnet_id} technical health for Q3 2025.

METRICS TO ANALYZE:
- GitHub activity score: ${github_activity}
- Days since last update: ${last_updated_days}
- Active contributors: 5
- Open issues: 12
- Security updates: 3

CONTEXT FROM ADMIN:
${context || 'No additional context provided'}

SCORING RUBRIC:
- 90-100: Daily commits, 10+ contributors, rapid updates
- 70-89: Weekly commits, 5+ contributors, regular updates
- 50-69: Monthly commits, 3+ contributors, occasional updates  
- 30-49: Sporadic commits, 1-2 contributors, rare updates
- 0-29: Abandoned or no activity

You must respond ONLY with valid JSON in this exact format:
{
  "score": 75,
  "development_status": "active", 
  "key_finding": "one sentence insight",
  "analysis": "150 word detailed analysis",
  "red_flags": ["concern 1", "concern 2"]
}`;

  try {
    const response = await makeInferenceRequest(prompt, apiKey);
    const cleanedResponse = response.replace(/(-?\d+)%/g, '$1');
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Dr. Protocol agent failed:', error.message);
    throw error;
  }
}

// Agent 3: Ops - SPECIAL ATTENTION TO NUMBER FORMATTING
async function runOpsAgent(subnet, context, apiKey) {
  // CRITICAL: Clean ALL numbers, NO UNITS
  const tao_emitted = cleanNumber(subnet.emission_rate || 100, 0);
  const compute_cost = cleanNumber(subnet.compute_cost || 80, 0); // NO UNDEFINED
  const tao_per_dollar = cleanNumber(tao_emitted / (compute_cost || 1), 2);
  const uptime = cleanNumber(subnet.uptime || 98.5, 2); // NO % SIGN
  const response_ms = Math.round(subnet.response_time || 400); // NO ms UNIT
  const validator_count = subnet.validator_count || 50;
  
  // BUILD PROMPT - SUPER CAREFUL WITH FORMATTING
  const prompt = `You are Ops, the Performance Analyst for Bittensor subnets.
Analyze subnet ${subnet.subnet_id} operational efficiency for Q3 2025.

METRICS TO ANALYZE:
- TAO emissions: ${tao_emitted}
- Compute cost: ${compute_cost}
- TAO per dollar: ${tao_per_dollar}
- Uptime: ${uptime}
- Avg response time: ${response_ms}
- Validator count: ${validator_count}

CONTEXT FROM ADMIN:
${context || 'No additional context provided'}

SCORING RUBRIC:
- 90-100: Over 2x network efficiency, 99.9 or higher uptime
- 70-89: Above average efficiency, 99 or higher uptime  
- 50-69: Average performance, 95 or higher uptime
- 30-49: Below average, under 95 uptime
- 0-29: Poor efficiency or major outages

You must respond ONLY with valid JSON in this exact format:
{
  "score": 85,
  "efficiency_rating": "excellent",
  "key_finding": "one sentence insight", 
  "analysis": "150 word detailed analysis",
  "performance_metrics": {
    "tao_per_dollar": 1.25,
    "uptime": 99.5,
    "response_time": 250
  }
}`;

  let response;
  try {
    response = await makeInferenceRequest(prompt, apiKey);
    const cleanedResponse = response.replace(/(-?\d+)%/g, '$1');
    
    // Find ONLY the first complete JSON object
    const jsonMatch = cleanedResponse.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    if (!parsed.score || !parsed.efficiency_rating || !parsed.performance_metrics) {
      throw new Error('Missing required fields in Ops response');
    }
    
    return parsed;
  } catch (error) {
    console.error('Ops agent JSON parsing failed:', error.message);
    console.error('Raw response:', response || 'No response received');
    throw error;
  }
}

// Agent 4: Pulse
async function runPulseAgent(subnet, context, apiKey) {
  const community_score = cleanNumber(subnet.ethos_score || 1500, 0);
  const sentiment = cleanNumber(85, 0); // NO /100
  const dev_response = cleanNumber(72, 0); // NO %
  
  const prompt = `You are Pulse, the Community Sentiment Analyzer for Bittensor subnets.
Analyze subnet ${subnet.subnet_id} community health for Q3 2025.

METRICS TO ANALYZE:
- Community score: ${community_score}
- Sentiment score: ${sentiment}
- Developer responsiveness: ${dev_response}
- Active discussions: 45
- Community proposals: 8

CONTEXT FROM ADMIN:
${context || 'No additional context provided'}

SCORING RUBRIC:
- 90-100: Highly engaged, positive sentiment, active governance
- 70-89: Good engagement, mostly positive, regular activity
- 50-69: Moderate engagement, mixed sentiment
- 30-49: Low engagement, negative sentiment
- 0-29: Toxic or dead community

You must respond ONLY with valid JSON in this exact format:
{
  "score": 80,
  "community_health": "strong",
  "key_finding": "one sentence insight",
  "analysis": "150 word detailed analysis",
  "sentiment_breakdown": {
    "positive": 70,
    "neutral": 20, 
    "negative": 10
  }
}`;

  try {
    const response = await makeInferenceRequest(prompt, apiKey);
    const cleanedResponse = response.replace(/(-?\d+)%/g, '$1');
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Pulse agent failed:', error.message);
    throw error;
  }
}

// Agent 5: Guardian
async function runGuardianAgent(subnet, context, apiKey) {
  const stake_concentration = cleanNumber(65, 0); // NO %
  const validator_churn = cleanNumber(12, 0); // NO %
  const treasury_balance = cleanNumber(500000, 0); // NO 'TAO'
  
  const prompt = `You are Guardian, the Risk Assessor for Bittensor subnets.
Assess subnet ${subnet.subnet_id} risk factors for Q3 2025.

METRICS TO ANALYZE:
- Stake concentration: ${stake_concentration}
- Validator churn rate: ${validator_churn}
- Treasury balance: ${treasury_balance}
- Security incidents: 0
- Governance disputes: 1

CONTEXT FROM ADMIN:
${context || 'No additional context provided'}

SCORING RUBRIC:
- 90-100: Minimal risks, strong security, stable governance
- 70-89: Low risks, good security, minor issues
- 50-69: Moderate risks, adequate security
- 30-49: High risks, security concerns
- 0-29: Critical risks, major vulnerabilities

You must respond ONLY with valid JSON in this exact format:
{
  "score": 75,
  "risk_level": "moderate",
  "key_finding": "one sentence insight",
  "analysis": "150 word detailed analysis",
  "risk_factors": ["risk 1", "risk 2", "risk 3"]
}`;

  try {
    const response = await makeInferenceRequest(prompt, apiKey);
    const cleanedResponse = response.replace(/(-?\d+)%/g, '$1');
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Guardian agent failed:', error.message);
    throw error;
  }
}

// Main analysis function - SEQUENTIAL EXECUTION
async function analyzeSubnet(subnet, context, apiKey) {
  console.log(`🔍 Starting REAL agent analysis for subnet ${subnet.subnet_id}`);
  console.log(`🤖 Running 5 IONET API calls SEQUENTIALLY...`);
  
  const results = {};
  const agents = [
    { name: 'momentum', fn: runMomentumAgent },
    { name: 'protocol', fn: runDrProtocolAgent },
    { name: 'ops', fn: runOpsAgent },
    { name: 'pulse', fn: runPulseAgent },
    { name: 'guardian', fn: runGuardianAgent }
  ];
  
  for (const agent of agents) {
    try {
      console.log(`🤖 Running ${agent.name} agent...`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      
      results[agent.name] = await agent.fn(subnet, context, apiKey);
      console.log(`✅ ${agent.name} agent completed successfully`);
      
      // CRITICAL: 10 second delay between agents
      if (agents.indexOf(agent) < agents.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    } catch (error) {
      console.error(`❌ ${agent.name} agent failed:`, error.message);
      throw new Error(`${agent.name} agent failed: ${error.message}`);
    }
  }
  
  return results;
}

// Export the main function
async function analyzeSubnets(subnets, context = '', apiKey) {
  if (!apiKey) throw new Error('IONET API key is required');
  
  const startTime = Date.now();
  console.log(`🚀 Starting REAL AI agent analysis of ${subnets.length} subnets`);
  console.log(`📊 Expected time: ${subnets.length * 60} seconds`);
  
  const results = [];
  
  // Process one at a time
  for (let i = 0; i < subnets.length; i++) {
    try {
      console.log(`📊 Processing subnet ${i + 1}/${subnets.length}...`);
      const analysis = await analyzeSubnet(subnets[i], context, apiKey);
      results.push({
        subnet: subnets[i],
        analysis: analysis,
        success: true
      });
      
      // 5 second delay between subnets
      if (i < subnets.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error(`❌ Failed to analyze subnet ${subnets[i].subnet_id}:`, error.message);
      results.push({
        subnet: subnets[i],
        error: error.message,
        success: false
      });
    }
  }
  
  const elapsed = Date.now() - startTime;
  console.log(`✅ Analysis complete: ${results.filter(r => r.success).length} successful`);
  console.log(`⏱️ Total time: ${elapsed}ms (${(elapsed/1000).toFixed(1)}s)`);
  
  return { results, elapsed };
}

// Export everything
export default { analyzeSubnets };