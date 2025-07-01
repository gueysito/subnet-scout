// IONetClient.js - IO.net API integration for enhanced inference
class IONetClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.intelligence.io.solutions/api/v1';
    
    // Optimal model selection based on IO.net documentation and our use cases
    this.models = {
      // Best for sentiment analysis and risk assessment (excellent reasoning)
      sentiment: 'meta-llama/Llama-3.3-70B-Instruct',
      risk: 'meta-llama/Llama-3.3-70B-Instruct',
      
      // Best for trend prediction and comparative analysis (strong analytical capabilities)
      trends: 'deepseek-ai/DeepSeek-R1',
      comparison: 'deepseek-ai/DeepSeek-R1',
      
      // Fallback for general analysis
      general: 'meta-llama/Llama-3.3-70B-Instruct'
    };
    
    // Model capabilities and quotas (from IO.net docs)
    this.modelInfo = {
      'meta-llama/Llama-3.3-70B-Instruct': {
        dailyQuota: 500000, // 500k tokens/day
        contextLength: 128000,
        strengths: ['reasoning', 'sentiment_analysis', 'risk_assessment']
      },
      'deepseek-ai/DeepSeek-R1': {
        dailyQuota: 500000,
        contextLength: 128000,
        strengths: ['analytical_reasoning', 'trend_prediction', 'comparison']
      }
    };
    
    console.log('🤖 IO.net Client initialized with optimized model selection');
  }

  /**
   * Generic inference request to IO.net
   */
  async makeInferenceRequest(model, messages, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature || 0.7,
          max_completion_tokens: options.maxTokens || 500,
          reasoning_content: options.reasoning || false,
          ...options
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`IO.net API Error ${response.status}: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ IO.net inference completed - Model: ${model}`);
      
      return {
        content: data.choices[0]?.message?.content || '',
        usage: data.usage,
        model: data.model,
        reasoning: data.choices[0]?.message?.reasoning_content || null
      };
      
    } catch (error) {
      console.error(`❌ IO.net inference failed:`, error.message);
      throw new Error(`IO.net inference failed: ${error.message}`);
    }
  }

  /**
   * Market sentiment analysis for subnet recommendations
   */
  async analyzeMarketSentiment(subnetData, historicalData = null) {
    const model = this.models.sentiment;
    
    const prompt = `Analyze the market sentiment and investment attractiveness for this Bittensor subnet:

**Subnet Data:**
- ID: ${subnetData.subnet_id}
- Overall Score: ${subnetData.overall_score}/100
- Yield: ${subnetData.metrics?.current_yield || 'N/A'}%
- Activity Level: ${subnetData.metrics?.activity_level || 'N/A'}
- Risk Level: ${subnetData.metrics?.risk_level || 'N/A'}
- Validator Count: ${subnetData.breakdown?.validator_count || 'N/A'}

${historicalData ? `**Historical Context:**
${JSON.stringify(historicalData, null, 2)}` : ''}

Provide a sentiment analysis focusing on:
1. Market confidence indicators (Strong Buy/Buy/Hold/Sell/Strong Sell)
2. Key sentiment drivers (positive/negative factors)
3. Community and validator sentiment
4. Risk/reward assessment

Format: 2-3 sentences with clear sentiment classification.`;

    const messages = [
      { role: 'system', content: 'You are an expert cryptocurrency and DeFi market analyst specializing in Bittensor ecosystem sentiment analysis.' },
      { role: 'user', content: prompt }
    ];

    return await this.makeInferenceRequest(model, messages, {
      temperature: 0.6,
      maxTokens: 300
    });
  }

  /**
   * Performance trend prediction using historical data
   */
  async predictPerformanceTrends(subnetData, historicalMetrics) {
    const model = this.models.trends;
    
    const prompt = `Predict performance trends for this Bittensor subnet based on historical data:

**Current Metrics:**
- Subnet ID: ${subnetData.subnet_id}
- Current Score: ${subnetData.overall_score}/100
- Yield Trend: ${subnetData.metrics?.yield_change_24h || 0}% (24h)
- Activity Score: ${subnetData.breakdown?.activity_score || 'N/A'}/100
- Credibility Score: ${subnetData.breakdown?.credibility_score || 'N/A'}/100

**Historical Data Pattern:**
${JSON.stringify(historicalMetrics, null, 2)}

Analyze and predict:
1. Short-term trend (7-day outlook)
2. Medium-term trend (30-day outlook)  
3. Key performance indicators likely to change
4. Potential risk factors or opportunities

Format: Clear predictions with confidence levels and timeframes.`;

    const messages = [
      { role: 'system', content: 'You are a quantitative analyst specializing in blockchain network performance prediction and trend analysis.' },
      { role: 'user', content: prompt }
    ];

    return await this.makeInferenceRequest(model, messages, {
      temperature: 0.5, // Lower temperature for more analytical predictions
      maxTokens: 400,
      reasoning: true // Enable reasoning content for trend analysis
    });
  }

  /**
   * Enhanced risk assessment refinement
   */
  async refineRiskAssessment(subnetData, networkContext = {}) {
    const model = this.models.risk;
    
    const prompt = `Provide a detailed risk assessment for this Bittensor subnet:

**Subnet Analysis:**
- ID: ${subnetData.subnet_id}
- Overall Score: ${subnetData.overall_score}/100
- Current Risk Level: ${subnetData.metrics?.risk_level || 'Unknown'}
- Validator Count: ${networkContext.validator_count || 'N/A'}
- Network Participation: ${subnetData.metrics?.network_participation || 'N/A'}%
- Validator Efficiency: ${subnetData.metrics?.validator_efficiency || 'N/A'}

**Network Context:**
- Total Network Validators: ${networkContext.total_validators || 'N/A'}
- Market Conditions: ${networkContext.market_conditions || 'Normal'}
- Recent Network Events: ${networkContext.events || 'None'}

Assess risks across:
1. **Technical Risks**: Network stability, validator reliability
2. **Economic Risks**: Yield sustainability, market volatility  
3. **Operational Risks**: Validator centralization, network attacks
4. **Strategic Risks**: Competition, technology changes

Provide risk rating (1-10) and mitigation strategies.`;

    const messages = [
      { role: 'system', content: 'You are a blockchain security and risk management expert with deep knowledge of Bittensor network dynamics.' },
      { role: 'user', content: prompt }
    ];

    return await this.makeInferenceRequest(model, messages, {
      temperature: 0.4, // Low temperature for consistent risk assessment
      maxTokens: 500
    });
  }

  /**
   * Comparative subnet analysis
   */
  async compareSubnets(targetSubnet, comparisionSubnets, metrics = ['yield', 'activity', 'credibility']) {
    const model = this.models.comparison;
    
    const prompt = `Compare Bittensor subnets across key performance metrics:

**Target Subnet:**
${JSON.stringify(targetSubnet, null, 2)}

**Comparison Subnets:**
${JSON.stringify(comparisionSubnets, null, 2)}

**Analysis Focus:** ${metrics.join(', ')}

Provide comparative analysis including:
1. **Ranking**: Order subnets by overall performance
2. **Strengths**: What each subnet does best
3. **Weaknesses**: Key areas for improvement
4. **Investment Recommendation**: Best choices for different strategies
5. **Risk-Adjusted Returns**: Performance vs risk analysis

Format: Clear comparison table and actionable insights.`;

    const messages = [
      { role: 'system', content: 'You are a portfolio analyst specializing in DeFi protocol comparison and investment strategy optimization.' },
      { role: 'user', content: prompt }
    ];

    return await this.makeInferenceRequest(model, messages, {
      temperature: 0.6,
      maxTokens: 600,
      reasoning: true
    });
  }

  /**
   * Check model availability and quotas
   */
  async checkModelHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      const data = await response.json();
      const availableModels = data.data?.map(model => model.id) || [];
      
      // Check if our preferred models are available
      const modelStatus = {};
      for (const [task, modelId] of Object.entries(this.models)) {
        modelStatus[task] = {
          model: modelId,
          available: availableModels.includes(modelId),
          info: this.modelInfo[modelId]
        };
      }
      
      console.log('🔍 IO.net Model Health Check:', modelStatus);
      return modelStatus;
      
    } catch (error) {
      console.error('❌ IO.net health check failed:', error.message);
      throw error;
    }
  }

  /**
   * Get optimal model for specific task
   */
  getModelForTask(task) {
    return this.models[task] || this.models.general;
  }

  /**
   * Estimate token usage for quota management
   */
  estimateTokenUsage(prompt, expectedResponse = 500) {
    // Rough estimation: ~4 characters per token
    const promptTokens = Math.ceil(prompt.length / 4);
    const responseTokens = expectedResponse;
    return promptTokens + responseTokens;
  }
}

export default IONetClient; 