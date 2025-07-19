import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Users, FileText, Send, Eye, EyeOff, Zap, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import apiClient from '../../shared/utils/apiClient';

const ScoutBriefAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [stats, setStats] = useState(null);
  const [context, setContext] = useState('');
  const [quarter, setQuarter] = useState('Q1');
  const [year, setYear] = useState(new Date().getFullYear());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [reportsList, setReportsList] = useState([]);
  const [showReportsHistory, setShowReportsHistory] = useState(false);
  const [showContextsManager, setShowContextsManager] = useState(false);
  const [contextsList, setContextsList] = useState([]);

  // Check authentication status and job tracking on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.get('/api/scoutbrief/admin/status');
        if (response.authenticated) {
          setIsAuthenticated(true);
          updateStats();
        }
      } catch (error) {
        console.warn('Auth check failed:', error.message);
      }
    };
    checkAuth();
    
    // Persistent job tracking
    const savedJob = localStorage.getItem('currentAnalysisJob');
    if (savedJob) {
      setIsAnalyzing(true);
      pollForStatus(savedJob);
    } else {
      fetch('/api/scoutbrief/admin/running-jobs')
        .then(res => res.json())
        .then(data => {
          if (data.runningJob) {
            localStorage.setItem('currentAnalysisJob', data.runningJob);
            setIsAnalyzing(true);
            pollForStatus(data.runningJob);
          }
        })
        .catch(console.error);
    }
  }, [pollForStatus]);

  const updateStats = async () => {
    try {
      const [contextsRes, reportsRes] = await Promise.all([
        apiClient.get('/api/scoutbrief/admin/contexts'),
        apiClient.get('/api/scoutbrief/admin/reports-list')
      ]);
      
      setStats({
        active_subscribers: 0,
        brief_contexts: contextsRes.contexts?.length || 0,
        brief_generations: reportsRes.reports?.length || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error.message);
      setStats({
        active_subscribers: 0,
        brief_contexts: 0,
        brief_generations: 0,
        error: true
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      const response = await apiClient.post('/api/scoutbrief/admin/login', {
        password: password.trim()
      });
      
      if (response.success) {
        setIsAuthenticated(true);
        setPassword('');
        updateStats();
      } else {
        setAuthError('Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setAuthError('Authentication failed');
    }
  };

  const handleSubmitContext = async (e) => {
    e.preventDefault();
    if (!context.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await apiClient.post('/api/scoutbrief/admin/context', {
        quarter,
        year: parseInt(year),
        context: context.trim()
      });

      if (response.success) {
        setSubmitStatus('success');
        setContext('');
        updateStats();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Context submit error:', error.message);
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        setSubmitStatus('auth_error');
      } else {
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadLatestReport = async () => {
    try {
      const res = await fetch('/api/scoutbrief/admin/latest-report');
      const { report } = await res.json();
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ScoutBrief_${report.id}.json`;
      a.click();
    } catch {
      alert('No reports available for download');
    }
  };

  const fetchReports = async () => {
    try {
      const response = await apiClient.get('/api/scoutbrief/admin/reports-list');
      setReportsList(response.reports || []);
    } catch (error) {
      console.error('Failed to load reports:', error.message);
    }
  };

  const handleLoadReportsHistory = async () => {
    await fetchReports();
    setShowReportsHistory(true);
  };

  const fetchContexts = async () => {
    try {
      const response = await apiClient.get('/api/scoutbrief/admin/contexts');
      setContextsList(response.contexts || []);
    } catch (error) {
      console.error('Failed to load contexts:', error.message);
    }
  };

  const handleManageContexts = async () => {
    await fetchContexts();
    setShowContextsManager(true);
  };

  const pollForStatus = useCallback(async (jobId) => {
    let attempts = 0;
    const MAX_ATTEMPTS = 1000; // ~2.7 hours
    
    const checkStatus = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/scoutbrief/admin/analysis-status/${jobId}`);
        const status = await res.json();
        
        setAnalysisProgress(`${status.progress}/${status.total} - ${status.currentSubnet}`);
        
        if (status.status === 'completed') {
          clearInterval(checkStatus);
          localStorage.removeItem('currentAnalysisJob');
          const reportRes = await fetch('/api/scoutbrief/admin/latest-report');
          const { report } = await reportRes.json();
          
          // Auto-download
          const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `ScoutBrief_${report.id}.json`;
          a.click();
          
          alert('Report completed and downloaded!');
          fetchReports();
          setIsAnalyzing(false);
        }
        
        if (attempts >= MAX_ATTEMPTS) {
          clearInterval(checkStatus);
          alert('Check "View Latest Report" manually');
          setIsAnalyzing(false);
        }
      } catch (error) {
        console.error('Poll error - continuing:', error);
      }
    }, 10000);
  }, [fetchReports, setIsAnalyzing]);

  const startBackgroundAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress('Starting...');

    try {
      const response = await apiClient.post('/api/scoutbrief/admin/start-analysis', {});
      
      if (response.success && response.jobId) {
        localStorage.setItem('currentAnalysisJob', response.jobId);
        pollForStatus(response.jobId);
      } else {
        setIsAnalyzing(false);
        alert('Failed to start analysis');
      }
    } catch (error) {
      console.error('Analysis start failed:', error.message);
      setIsAnalyzing(false);
      alert('Failed to start analysis');
    }
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-zinc-900/60 backdrop-blur-sm p-8 rounded-xl border border-zinc-700">
          <div className="text-center mb-8">
            <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">ScoutBrief Admin</h1>
            <p className="text-gray-400">Access the quarterly intelligence admin panel</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-lg bg-red-900/50 border border-red-700 text-red-300 text-sm">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg text-white font-semibold transition-colors duration-200"
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">ScoutBrief Admin Panel</h1>
          <p className="text-gray-400">Manage quarterly intelligence brief generation</p>
          <button 
            onClick={updateStats}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
          >
            Refresh Stats
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900/60 backdrop-blur-sm p-6 rounded-xl border border-zinc-700">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-400 mr-3" />
              <div>
                <h3 className="text-lg font-bold text-white">
                  {stats ? stats.active_subscribers : '...'}
                </h3>
                <p className="text-sm text-gray-400">Active Subscribers</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-sm p-6 rounded-xl border border-zinc-700">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-400 mr-3" />
              <div>
                <h3 className="text-lg font-bold text-white">
                  {stats ? stats.brief_contexts : '...'}
                </h3>
                <p className="text-sm text-gray-400">Brief Contexts</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-sm p-6 rounded-xl border border-zinc-700">
            <div className="flex items-center">
              <Send className="w-8 h-8 text-purple-400 mr-3" />
              <div>
                <h3 className="text-lg font-bold text-white">
                  {stats ? stats.brief_generations : 0}
                </h3>
                <p className="text-sm text-gray-400">Generated Reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Context Input Form */}
        <div className="bg-zinc-900/60 backdrop-blur-sm p-8 rounded-xl border border-zinc-700">
          <h2 className="text-2xl font-bold text-white mb-6">Add Brief Context</h2>
          
          <form onSubmit={handleSubmitContext}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quarter
                </label>
                <select
                  value={quarter}
                  onChange={(e) => setQuarter(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Q1">Q1 (Jan-Mar)</option>
                  <option value="Q2">Q2 (Apr-Jun)</option>
                  <option value="Q3">Q3 (Jul-Sep)</option>
                  <option value="Q4">Q4 (Oct-Dec)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="2024"
                  max="2030"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Context for AI Agents
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Provide context, data points, and guidance for the AI agents to generate the quarterly brief..."
                rows={8}
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                This context will guide all 5 AI agents (Momentum, Dr. Protocol, Ops, Pulse, Guardian) in generating the quarterly intelligence brief.
              </p>
            </div>

            {submitStatus === 'success' && (
              <div className="mb-4 p-4 rounded-lg bg-green-900/50 border border-green-700 text-green-300">
                ✅ Context submitted successfully! The quarterly brief context has been saved.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-4 p-4 rounded-lg bg-red-900/50 border border-red-700 text-red-300">
                ❌ Failed to submit context. Please try again.
              </div>
            )}

            {submitStatus === 'auth_error' && (
              <div className="mb-4 p-4 rounded-lg bg-yellow-900/50 border border-yellow-700 text-yellow-300">
                🔐 Session expired. Please refresh the page and log in again.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !context.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-200"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Context'}
            </button>
          </form>
        </div>

        {/* Report Generation Section */}
        <div className="bg-zinc-900/60 backdrop-blur-sm p-8 rounded-xl border border-zinc-700 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">ScoutBrief Intelligence System</h2>
          
          <div className="mb-6">
            <p className="text-gray-300 mb-6">
              AI-powered analysis of the top 20 Bittensor subnets using all 5 specialist agents.
            </p>
            
            {/* Single Generate Button */}
            <div className="mb-6">
              <button
                onClick={startBackgroundAnalysis}
                disabled={isAnalyzing}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed px-8 py-4 rounded-lg text-white font-bold text-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <Clock className="w-6 h-6 mr-3 animate-spin" />
                    Analyzing... {analysisProgress}
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6 mr-3" />
                    Generate Report (20 Subnets)
                  </>
                )}
              </button>
            </div>

            {/* Big Download Latest Button */}
            <div className="mb-6">
              <button 
                onClick={downloadLatestReport}
                className="w-full text-white font-bold transition-colors duration-200 flex items-center justify-center"
                style={{ fontSize: '20px', padding: '20px', backgroundColor: '#4CAF50' }}
              >
                <FileText className="w-8 h-8 mr-3" />
                DOWNLOAD LATEST REPORT
              </button>
            </div>

            {/* Management Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleLoadReportsHistory}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-200 flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Reports History
              </button>
              
              <button
                onClick={handleManageContexts}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-200 flex items-center"
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Contexts
              </button>
            </div>
          </div>
        </div>

        {/* Reports History Section */}
        {showReportsHistory && (
          <div className="bg-zinc-900/60 backdrop-blur-sm p-8 rounded-xl border border-zinc-700 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Reports History</h2>
              <button
                onClick={() => setShowReportsHistory(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white font-semibold"
              >
                Close
              </button>
            </div>
            
            {reportsList.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No reports generated yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reportsList.map((report) => (
                  <div key={report.id} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-600">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                        <div className="text-sm text-gray-400 mt-1">
                          <span>Generated: {new Date(report.generated_at).toLocaleString()}</span>
                          <span className="mx-2">•</span>
                          <span>Subnets: {report.subnets_analyzed}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `ScoutBrief_${report.id}.json`;
                            a.click();
                          }}
                          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm"
                        >
                          Download
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Delete this report?')) {
                              try {
                                await fetch(`/api/scoutbrief/admin/report/${report.id}`, { method: 'DELETE' });
                                fetchReports();
                                updateStats();
                              } catch {
                                alert('Failed to delete report');
                              }
                            }
                          }}
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Context Manager Section */}
        {showContextsManager && (
          <div className="bg-zinc-900/60 backdrop-blur-sm p-8 rounded-xl border border-zinc-700 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Context Manager</h2>
              <button
                onClick={() => setShowContextsManager(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white font-semibold"
              >
                Close
              </button>
            </div>
            
            {contextsList.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No contexts added yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contextsList.map((context, index) => (
                  <div key={index} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-600">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          {context.quarter} {context.year} Context
                        </h3>
                        <div className="text-sm text-gray-400 mt-1">
                          <span>Created: {new Date(context.created_at).toLocaleString()}</span>
                        </div>
                        <div className="mt-3 p-3 bg-zinc-700/50 rounded text-sm text-gray-300 max-h-32 overflow-y-auto">
                          {context.content}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => {
                            // Copy context to clipboard
                            navigator.clipboard.writeText(context.content);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm"
                        >
                          Copy
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Delete this context?')) {
                              try {
                                await fetch(`/api/scoutbrief/admin/context/${index}`, { method: 'DELETE' });
                                fetchContexts();
                                updateStats();
                              } catch {
                                alert('Failed to delete context');
                              }
                            }
                          }}
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ScoutBriefAdmin;