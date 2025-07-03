// PredictiveAnalyticsDashboard.jsx - Comprehensive AI Insights Dashboard
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, RadialBarChart, RadialBar
} from 'recharts';
import {
  ArrowTrendingUpIcon, ArrowTrendingDownIcon, ShieldExclamationIcon, 
  ExclamationTriangleIcon, ChartBarIcon, CurrencyDollarIcon,
  ArrowUpIcon, ArrowDownIcon, ClockIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';

const PredictiveAnalyticsDashboard = ({ subnetId = 1 }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { get } = useApi();

  // Fetch comprehensive AI insights
  const fetchAIInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🤖 Fetching comprehensive AI insights...');
      
      // Fetch all AI insights in parallel
      const [forecastResponse, riskResponse, anomalyResponse, investmentResponse] = await Promise.all([
        get(`/api/insights/forecast/${subnetId}`),
        get(`/api/insights/risk/${subnetId}`),
        get(`/api/insights/anomalies/${subnetId}`),
        get(`/api/insights/investment/${subnetId}`)
      ]);

      // Combine all insights
      const combinedData = {
        forecast: forecastResponse.data,
        risk: riskResponse.data,
        anomalies: anomalyResponse.data,
        investment: investmentResponse.data,
        metadata: {
          last_updated: new Date().toISOString(),
          subnet_id: subnetId
        }
      };

      setAnalysisData(combinedData);
      console.log('✅ AI insights loaded successfully');
      
    } catch (err) {
      console.error('❌ Failed to fetch AI insights:', err);
      setError(err.message || 'Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, [subnetId]);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(fetchAIInsights, 120000);
    return () => clearInterval(interval);
  }, [subnetId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Loading AI Insights...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Error Loading AI Insights</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button
              onClick={fetchAIInsights}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return <div className="p-8 text-center">No data available</div>;
  }

  const tabs = [
    { id: 'overview', name: 'AI Overview', icon: ChartBarIcon },
    { id: 'forecast', name: '7-Day Forecast', icon: ArrowTrendingUpIcon },
    { id: 'risk', name: 'Risk Analysis', icon: ShieldExclamationIcon },
    { id: 'anomalies', name: 'Anomaly Detection', icon: ExclamationTriangleIcon },
    { id: 'investment', name: 'Investment Insights', icon: CurrencyDollarIcon }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            🤖 AI Insights Dashboard
          </h2>
          <p className="text-gray-600">
            Subnet {subnetId} • {analysisData.investment.subnet_name} • Last updated: {' '}
            {new Date(analysisData.metadata.last_updated).toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={fetchAIInsights}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Quick Stats Cards */}
      <QuickStatsCards data={analysisData} />

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && <OverviewTab data={analysisData} />}
        {activeTab === 'forecast' && <ForecastTab data={analysisData.forecast} />}
        {activeTab === 'risk' && <RiskAnalysisTab data={analysisData.risk} />}
        {activeTab === 'anomalies' && <AnomalyDetectionTab data={analysisData.anomalies} />}
        {activeTab === 'investment' && <InvestmentInsightsTab data={analysisData.investment} />}
      </div>
    </div>
  );
};

// Quick Stats Cards Component
const QuickStatsCards = ({ data }) => {
  const stats = [
    {
      name: 'Investment Rating',
      value: data.investment.investment_recommendation.recommendation,
      icon: CurrencyDollarIcon,
      color: getRecommendationColor(data.investment.investment_recommendation.recommendation),
      change: `${data.investment.investment_recommendation.confidence_level}% confidence`
    },
    {
      name: 'Risk Level',
      value: data.risk.risk_assessment.composite_risk.risk_level,
      icon: ShieldExclamationIcon,
      color: getRiskColor(data.risk.risk_assessment.composite_risk.risk_level),
      change: `${data.risk.risk_assessment.composite_risk.risk_score}/100 score`
    },
    {
      name: 'Anomaly Score',
      value: `${data.anomalies.detection_summary.anomaly_score}/100`,
      icon: ExclamationTriangleIcon,
      color: getAnomalyColor(data.anomalies.detection_summary.anomaly_score),
      change: `${data.anomalies.detection_summary.total_anomalies} detected`
    },
    {
      name: '7-Day Forecast',
      value: data.forecast.forecast.expected_return > 0 ? 'Positive' : 'Negative',
      icon: ArrowTrendingUpIcon,
      color: data.forecast.forecast.expected_return > 0 ? 'text-green-600' : 'text-red-600',
      change: `${(data.forecast.forecast.expected_return * 100).toFixed(1)}% expected`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.name} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className={`text-2xl font-semibold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <Icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ data }) => {
  // Prepare data for composite score visualization
  const scoreData = [
    {
      category: 'Investment Score',
      score: data.investment.investment_recommendation.investment_score,
      color: '#3B82F6'
    },
    {
      category: 'Risk Score',
      score: 100 - data.risk.risk_assessment.composite_risk.risk_score, // Invert for positive visualization
      color: '#EF4444'
    },
    {
      category: 'Stability Score',
      score: 100 - data.anomalies.detection_summary.anomaly_score, // Invert for positive visualization
      color: '#10B981'
    }
  ];

  return (
    <div className="space-y-8">
      {/* AI Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment Thesis */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🎯 AI Investment Thesis</h3>
          <p className="text-blue-800 leading-relaxed">
            {data.investment.investment_thesis.investment_thesis}
          </p>
          <div className="mt-4 flex items-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              getRecommendationStyle(data.investment.investment_recommendation.recommendation)
            }`}>
              {data.investment.investment_recommendation.recommendation}
            </span>
            <span className="ml-3 text-blue-600 text-sm">
              {data.investment.investment_recommendation.confidence_level}% Confidence
            </span>
          </div>
        </div>

        {/* Risk Summary */}
        <div className="bg-amber-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-amber-900 mb-3">⚠️ Risk Assessment</h3>
          <p className="text-amber-800 leading-relaxed">
            {data.risk.risk_analysis.analysis_summary}
          </p>
          <div className="mt-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              getRiskStyle(data.risk.risk_assessment.composite_risk.risk_level)
            }`}>
              {data.risk.risk_assessment.composite_risk.risk_level} Risk
            </span>
          </div>
        </div>
      </div>

      {/* AI Scores Visualization */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 AI Analysis Scores</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={scoreData}>
              <RadialBar dataKey="score" cornerRadius={10} fill="#8884d8" />
              <Tooltip 
                formatter={(value) => [`${value}/100`, 'Score']}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Alerts */}
      {(data.anomalies.alerts.length > 0 || data.investment.risk_warnings.length > 0) && (
        <AlertsSection alerts={[...data.anomalies.alerts, ...data.investment.risk_warnings]} />
      )}
    </div>
  );
};

// Forecast Tab Component
const ForecastTab = ({ data }) => {
  // Prepare forecast chart data
  const forecastChartData = data.forecast.daily_predictions.map((day, index) => ({
    day: `Day ${index + 1}`,
    yield: day.predicted_yield,
    activity: day.predicted_activity,
    confidence: day.confidence
  }));

  return (
    <div className="space-y-6">
      {/* Forecast Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Expected Return</h3>
          <p className="text-2xl font-bold text-green-900">
            {(data.forecast.expected_return * 100).toFixed(1)}%
          </p>
          <p className="text-green-700 text-sm mt-1">7-day outlook</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Forecast Confidence</h3>
          <p className="text-2xl font-bold text-blue-900">
            {data.forecast.confidence_level}%
          </p>
          <p className="text-blue-700 text-sm mt-1">AI model certainty</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800">Model Used</h3>
          <p className="text-lg font-bold text-purple-900">
            {data.forecast.model_used}
          </p>
          <p className="text-purple-700 text-sm mt-1">AI reasoning engine</p>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 7-Day Performance Forecast</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="yield" stroke="#3B82F6" strokeWidth={3} name="Predicted Yield %" />
              <Line yAxisId="right" type="monotone" dataKey="activity" stroke="#10B981" strokeWidth={2} name="Activity Score" />
              <Area yAxisId="right" type="monotone" dataKey="confidence" stroke="#8B5CF6" fillOpacity={0.1} name="Confidence %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-indigo-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-indigo-900 mb-3">🧠 AI Model Insights</h3>
        <div className="space-y-2">
          {data.forecast.key_insights?.map((insight, index) => (
            <div key={index} className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-indigo-800">{insight}</p>
            </div>
          )) || (
            <p className="text-indigo-800">Forecast analysis indicates {data.forecast.expected_return > 0 ? 'positive' : 'negative'} trend over the next 7 days with {data.forecast.confidence_level}% confidence.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Risk Analysis Tab Component
const RiskAnalysisTab = ({ data }) => {
  const riskCategories = [
    {
      name: 'Technical Risk',
      score: data.risk_assessment.technical_risk.risk_score,
      level: data.risk_assessment.technical_risk.risk_level,
      concerns: data.risk_assessment.technical_risk.key_concerns
    },
    {
      name: 'Governance Risk',
      score: data.risk_assessment.governance_risk.risk_score,
      level: data.risk_assessment.governance_risk.risk_level,
      concerns: data.risk_assessment.governance_risk.key_concerns
    },
    {
      name: 'Economic Risk',
      score: data.risk_assessment.economic_risk.risk_score,
      level: data.risk_assessment.economic_risk.risk_level,
      concerns: data.risk_assessment.economic_risk.key_concerns
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Risk Score */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🛡️ Composite Risk Assessment</h3>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            getRiskStyle(data.risk_assessment.composite_risk.risk_level)
          }`}>
            {data.risk_assessment.composite_risk.risk_level} Risk
          </span>
        </div>
        <div className="flex items-center mb-2">
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${getRiskBarColor(data.risk_assessment.composite_risk.risk_score)}`}
              style={{ width: `${data.risk_assessment.composite_risk.risk_score}%` }}
            ></div>
          </div>
          <span className="ml-4 text-lg font-semibold">
            {data.risk_assessment.composite_risk.risk_score}/100
          </span>
        </div>
        <p className="text-gray-700 mt-3">{data.risk_analysis.analysis_summary}</p>
      </div>

      {/* Risk Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {riskCategories.map((category) => (
          <div key={category.name} className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
            <div className="flex items-center mb-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${getRiskBarColor(category.score)}`}
                  style={{ width: `${category.score}%` }}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium">{category.score}/100</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskStyle(category.level)}`}>
              {category.level}
            </span>
            {category.concerns.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-1">Key Concerns:</p>
                <ul className="text-xs text-gray-700">
                  {category.concerns.slice(0, 2).map((concern, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-500 mr-1">•</span>
                      {concern}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Anomaly Detection Tab Component
const AnomalyDetectionTab = ({ data }) => {
  const severityColors = {
    low: 'bg-yellow-100 text-yellow-800',
    moderate: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
    critical: 'bg-red-200 text-red-900'
  };

  const allAnomalies = [
    ...data.anomaly_categories.performance.anomalies,
    ...data.anomaly_categories.security.anomalies,
    ...data.anomaly_categories.economic.anomalies
  ].slice(0, 10); // Show top 10 anomalies

  return (
    <div className="space-y-6">
      {/* Anomaly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-900">{data.detection_summary.total_anomalies}</p>
          <p className="text-sm text-gray-600">Total Anomalies</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-900">{data.detection_summary.severity_distribution.low || 0}</p>
          <p className="text-sm text-yellow-700">Low Severity</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-orange-900">{data.detection_summary.severity_distribution.moderate || 0}</p>
          <p className="text-sm text-orange-700">Moderate</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-red-900">{(data.detection_summary.severity_distribution.high || 0) + (data.detection_summary.severity_distribution.critical || 0)}</p>
          <p className="text-sm text-red-700">High/Critical</p>
        </div>
      </div>

      {/* Anomaly Score Gauge */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Anomaly Detection Score</h3>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Normal (0-30)</span>
              <span>Moderate (31-60)</span>
              <span>High (61-100)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className={`h-6 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                  data.detection_summary.anomaly_score <= 30 ? 'bg-green-500' :
                  data.detection_summary.anomaly_score <= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.max(data.detection_summary.anomaly_score, 15)}%` }}
              >
                {data.detection_summary.anomaly_score}/100
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-700 mt-3">{data.ai_analysis.analysis_summary}</p>
      </div>

      {/* Recent Anomalies */}
      {allAnomalies.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Recent Anomalies Detected</h3>
          <div className="space-y-3">
            {allAnomalies.map((anomaly, index) => (
              <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="font-medium text-gray-900">{anomaly.metric}</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${severityColors[anomaly.severity]}`}>
                      {anomaly.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{anomaly.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Category: {anomaly.category} • Confidence: {anomaly.confidence}%
                  </p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4 inline mr-1" />
                  {new Date(anomaly.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Alerts */}
      {data.alerts.length > 0 && (
        <AlertsSection alerts={data.alerts} title="🚨 Active Anomaly Alerts" />
      )}
    </div>
  );
};

// Investment Insights Tab Component
const InvestmentInsightsTab = ({ data }) => {
  const recommendation = data.investment_recommendation.recommendation;
  const confidence = data.investment_recommendation.confidence_level;
  const priceTarget = data.investment_recommendation.price_target;

  return (
    <div className="space-y-6">
      {/* Investment Recommendation Card */}
      <div className={`p-6 rounded-lg ${getRecommendationBg(recommendation)}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">💰 Investment Recommendation</h3>
          <span className={`px-4 py-2 rounded-full text-lg font-bold ${getRecommendationStyle(recommendation)}`}>
            {recommendation}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Confidence Level</p>
            <p className="text-2xl font-bold text-gray-900">{confidence}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Investment Score</p>
            <p className="text-2xl font-bold text-gray-900">{data.investment_recommendation.investment_score}/100</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Time Horizon</p>
            <p className="text-lg font-semibold text-gray-900">{data.investment_recommendation.time_horizon.period}</p>
          </div>
        </div>
        <p className="text-gray-800 leading-relaxed">{data.investment_thesis.investment_thesis}</p>
      </div>

      {/* Price Target */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">🎯 Price Target</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-700">Current Price:</span>
              <span className="font-semibold">${priceTarget.current_price.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Target Price:</span>
              <span className="font-semibold">${priceTarget.target_price.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Implied Return:</span>
              <span className={`font-bold flex items-center ${priceTarget.implied_return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceTarget.implied_return >= 0 ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
                {priceTarget.implied_return.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-3">⏰ Market Timing</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-700">Timing Assessment:</span>
              <span className={`font-semibold px-2 py-1 rounded text-sm ${
                data.market_timing.timing === 'FAVORABLE' ? 'bg-green-100 text-green-800' :
                data.market_timing.timing === 'UNFAVORABLE' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {data.market_timing.timing}
              </span>
            </div>
            <p className="text-purple-700 text-sm">{data.market_timing.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Strategy Recommendations */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">🎲 Strategy Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(data.strategy_recommendations).map(([strategy, rec]) => (
            <div key={strategy} className="border rounded-lg p-4">
              <h5 className="font-medium text-gray-900 capitalize mb-2">{strategy} Strategy</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Recommendation:</span>
                  <span className={`font-medium ${getRecommendationColor(rec.recommendation)}`}>
                    {rec.recommendation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Allocation:</span>
                  <span className="font-medium">{rec.allocation}</span>
                </div>
                <p className="text-gray-700 text-xs mt-2">{rec.rationale}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Warnings */}
      {data.risk_warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h4 className="font-semibold text-amber-900 mb-3">⚠️ Investment Risk Warnings</h4>
          <div className="space-y-2">
            {data.risk_warnings.map((warning, index) => (
              <div key={index} className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    warning.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    warning.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {warning.severity}
                  </span>
                  <p className="text-amber-800 mt-1">{warning.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Alerts Section Component
const AlertsSection = ({ alerts, title = "🚨 Active Alerts" }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-red-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {alerts.slice(0, 5).map((alert, index) => (
          <div key={alert.id || index} className="flex items-start justify-between p-3 bg-red-100 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                <span className="font-medium text-red-900">{alert.type?.replace(/_/g, ' ').toUpperCase()}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  alert.severity === 'critical' ? 'bg-red-200 text-red-900' :
                  alert.severity === 'high' ? 'bg-orange-200 text-orange-900' :
                  'bg-yellow-200 text-yellow-900'
                }`}>
                  {alert.severity}
                </span>
              </div>
              <p className="text-sm text-red-800">{alert.message}</p>
            </div>
            <div className="text-right text-xs text-red-600">
              <ClockIcon className="h-4 w-4 inline mr-1" />
              {new Date(alert.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Utility functions for styling
const getRecommendationColor = (recommendation) => {
  switch (recommendation) {
    case 'STRONG_BUY': return 'text-green-700';
    case 'BUY': return 'text-green-600';
    case 'HOLD': return 'text-yellow-600';
    case 'SELL': return 'text-red-600';
    case 'STRONG_SELL': return 'text-red-700';
    default: return 'text-gray-600';
  }
};

const getRecommendationStyle = (recommendation) => {
  switch (recommendation) {
    case 'STRONG_BUY': return 'bg-green-100 text-green-800';
    case 'BUY': return 'bg-green-50 text-green-700';
    case 'HOLD': return 'bg-yellow-100 text-yellow-800';
    case 'SELL': return 'bg-red-50 text-red-700';
    case 'STRONG_SELL': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRecommendationBg = (recommendation) => {
  switch (recommendation) {
    case 'STRONG_BUY': case 'BUY': return 'bg-green-50 border border-green-200';
    case 'HOLD': return 'bg-yellow-50 border border-yellow-200';
    case 'SELL': case 'STRONG_SELL': return 'bg-red-50 border border-red-200';
    default: return 'bg-gray-50 border border-gray-200';
  }
};

const getRiskColor = (level) => {
  switch (level) {
    case 'Low': return 'text-green-600';
    case 'Moderate': return 'text-yellow-600';
    case 'High': return 'text-orange-600';
    case 'Critical': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const getRiskStyle = (level) => {
  switch (level) {
    case 'Low': return 'bg-green-100 text-green-800';
    case 'Moderate': return 'bg-yellow-100 text-yellow-800';
    case 'High': return 'bg-orange-100 text-orange-800';
    case 'Critical': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRiskBarColor = (score) => {
  if (score <= 30) return 'bg-green-500';
  if (score <= 60) return 'bg-yellow-500';
  if (score <= 80) return 'bg-orange-500';
  return 'bg-red-500';
};

const getAnomalyColor = (score) => {
  if (score <= 30) return 'text-green-600';
  if (score <= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export default PredictiveAnalyticsDashboard; 