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
  const [reportsList, setReportsList] = useState([]);
  const [showReportsHistory, setShowReportsHistory] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [reportData, setReportData] = useState(null);
  const [showContextsManager, setShowContextsManager] = useState(false);
  const [contextsList, setContextsList] = useState([]);

  const updateStats = useCallback(async () => {
    try {
      const [contextsRes, reportsRes, statsRes] = await Promise.all([
        fetch('/api/scoutbrief/admin/contexts'),
        fetch('/api/scoutbrief/admin/reports-list'),
        fetch('/api/scoutbrief/admin/stats')
      ]);
      
      const contextsData = await contextsRes.json();
      const reportsData = await reportsRes.json();
      const statsData = await statsRes.json();
      
      setStats({
        active_subscribers: statsData.active_subscribers || 0,
        brief_contexts: contextsData.contexts?.length || 0,
        brief_generations: reportsData.reports?.length || 0
      });
    } catch (error) {
      console.error('Failed to update stats:', error);
      setStats({
        active_subscribers: 0,
        brief_contexts: 0,
        brief_generations: 0,
        error: true
      });
    }
  }, []);

  const downloadReport = useCallback((report) => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ScoutBrief_${report.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const fetchReports = useCallback(async () => {
    try {
      const response = await fetch('/api/scoutbrief/admin/reports-list');
      const data = await response.json();
      setReportsList(data.reports || []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  }, []);

  const fetchContexts = useCallback(async () => {
    try {
      const response = await fetch('/api/scoutbrief/admin/contexts');
      const data = await response.json();
      setContextsList(data.contexts || []);
    } catch (error) {
      console.error('Failed to fetch contexts:', error);
    }
  }, []);

  const pollForStatus = useCallback(async (jobId) => {
    setIsAnalyzing(true);
    let attempts = 0;
    const MAX_ATTEMPTS = 1000; // 2.7 hours
    
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/scoutbrief/admin/analysis-status/${jobId}`);
        const status = await res.json();
        
        // Handle job not found
        if (status.status === 'not found') {
          clearInterval(interval);
          localStorage.removeItem('currentAnalysisJob');
          setIsAnalyzing(false);
          setAnalysisProgress('');
          return;
        }
        
        // Proper progress display with null checks
        const progress = status.progress || 0;
        const total = status.total || 20;
        const current = status.currentSubnet || 'Processing...';
        setAnalysisProgress(`${progress}/${total} - ${current}`);
        
        if (status.status === 'completed') {
          clearInterval(interval);
          localStorage.removeItem('currentAnalysisJob');
          setIsAnalyzing(false);
          setAnalysisProgress('');
          
          // Auto-download
          try {
            const reportRes = await fetch('/api/scoutbrief/admin/latest-report');
            const { report } = await reportRes.json();
            downloadReport(report);
            alert('Report completed and downloaded!');
          } catch (downloadError) {
            console.error('Download failed:', downloadError);
            alert('Report completed but download failed. Use "Download Latest Report".');
          }
          
          // Small delay to ensure backend has saved everything
          setTimeout(() => {
            fetchReports();
            updateStats();
          }, 1000);
        } else if (status.status === 'failed') {
          clearInterval(interval);
          localStorage.removeItem('currentAnalysisJob');
          setIsAnalyzing(false);
          setAnalysisProgress('');
          alert(`Analysis failed: ${status.error || 'Unknown error'}`);
        }
        
        if (attempts >= MAX_ATTEMPTS) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisProgress('');
          alert('Analysis timeout. Use "Download Latest Report".');
        }
      } catch (error) {
        console.error('Poll error:', error);
        // Continue polling but don't spam errors
      }
    }, 10000); // Every 10 seconds
  }, [fetchReports, updateStats, downloadReport]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.get('/api/scoutbrief/admin/status');
        if (response.authenticated) {
          setIsAuthenticated(true);
          updateStats();
          
          // Only check for saved jobs after authentication succeeds
          const savedJob = localStorage.getItem('currentAnalysisJob');
          if (savedJob) {
            // Verify job still exists before starting poll
            try {
              const statusRes = await fetch(`/api/scoutbrief/admin/analysis-status/${savedJob}`);
              const statusData = await statusRes.json();
              
              if (statusData.status && statusData.status !== 'not found' && 
                  statusData.status !== 'completed' && statusData.status !== 'failed') {
                pollForStatus(savedJob);
              } else {
                localStorage.removeItem('currentAnalysisJob');
              }
            } catch {
              localStorage.removeItem('currentAnalysisJob');
            }
          }
        }
      } catch (error) {
        console.warn('Auth check failed:', error.message);
      }
    };
    
    checkAuth();
  }, [pollForStatus, updateStats]);

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

  const handleDownloadReport = () => {
    if (!reportData) return;
    
    // Create downloadable JSON file
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ScoutBrief_${reportData.quarter}_${reportData.year}_Report.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleLoadReportsHistory = async () => {
    await fetchReports();
    setShowReportsHistory(true);
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
          <p className="text-gray-400">Manage monthly intelligence brief generation</p>
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
                  {stats ? stats.brief_generations : '...'}
                </h3>
                <p className="text-sm text-gray-400">Generated Briefs</p>
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
                This context will guide all 5 AI agents (Momentum, Dr. Protocol, Ops, Pulse, Guardian) in generating the monthly intelligence brief.
              </p>
            </div>

            {submitStatus === 'success' && (
              <div className="mb-4 p-4 rounded-lg bg-green-900/50 border border-green-700 text-green-300">
                ✅ Context submitted successfully! The monthly brief context has been saved.
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
          <h2 className="text-2xl font-bold text-white mb-6">Generate Monthly Report</h2>
          
          <div className="mb-6">
            <p className="text-gray-300 mb-4">
              Run AI agent analysis on the top 20 subnets using the latest monthly context.
              This will generate a comprehensive intelligence brief with insights from all 5 agents.
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
                    Generate Report
                  </>
                )}
              </button>
            </div>

            {/* Big Download Latest Button */}
            <div className="mb-6">
              <button 
                onClick={async () => {
                  try {
                    const res = await fetch('/api/scoutbrief/admin/latest-report');
                    const { report } = await res.json();
                    downloadReport(report);
                  } catch {
                    alert('No reports found');
                  }
                }}
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
                onClick={async () => {
                  await fetchContexts();
                  setShowContextsManager(true);
                }}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-200 flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Contexts
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
                          onClick={() => downloadReport(report)}
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

        {/* Contexts Manager Section */}
        {showContextsManager && (
          <div className="bg-zinc-900/60 backdrop-blur-sm p-8 rounded-xl border border-zinc-700 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Contexts Manager</h2>
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
                <p>No contexts saved yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contextsList.map((context) => (
                  <div key={context.id} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-600">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          {context.quarter} {context.year} Context
                        </h3>
                        <div className="text-sm text-gray-400 mt-1">
                          <span>Created: {new Date(context.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(context.context);
                            alert('Context copied to clipboard!');
                          }}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => {
                            const blob = new Blob([context.context], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `Context_${context.quarter}_${context.year}.txt`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                    <div className="bg-zinc-900/50 p-3 rounded text-sm text-gray-300 max-h-32 overflow-y-auto">
                      {context.context}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Report Preview Section */}
        {reportData && (
          <div className="bg-zinc-900/60 backdrop-blur-sm p-8 rounded-xl border border-zinc-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Report Preview</h2>
            
            {/* Report Metadata */}
            <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Quarter:</span>
                  <span className="text-white ml-2">{reportData.quarter} {reportData.year}</span>
                </div>
                <div>
                  <span className="text-gray-400">Analyzed:</span>
                  <span className="text-white ml-2">{reportData.successful_analyses} subnets</span>
                </div>
                <div>
                  <span className="text-gray-400">Generated:</span>
                  <span className="text-white ml-2">{new Date(reportData.generated_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-400">Failed:</span>
                  <span className="text-white ml-2">{reportData.failed_analyses} subnets</span>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="mb-8 p-6 bg-blue-900/20 border border-blue-700/30 rounded-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-4">📊 Executive Summary</h3>
              <div className="space-y-3 text-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{reportData.statistics?.average_score || 0}</div>
                    <div className="text-sm text-gray-400">Average Score</div>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{reportData.successful_analyses || 0}</div>
                    <div className="text-sm text-gray-400">Subnets Analyzed</div>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{Object.keys(reportData.agent_summaries || {}).length}</div>
                    <div className="text-sm text-gray-400">AI Agents Used</div>
                  </div>
                </div>
                <p className="mt-4 text-gray-300">
                  {reportData.summary || 'Comprehensive AI-powered analysis completed successfully.'}
                </p>
              </div>
            </div>

            {/* Top Performers */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-green-400 mb-4">🏆 Top Performers</h3>
              <div className="space-y-4">
                {reportData.top_performers?.map((subnet, index) => (
                  <div key={subnet.subnet_id} className="p-4 bg-green-900/20 border border-green-700/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold text-white">
                        #{index + 1} - {subnet.name || `Subnet ${subnet.subnet_id}`}
                      </h4>
                      <span className="text-green-400 font-bold">{subnet.overall_score}/100</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div><span className="text-green-300">Momentum:</span> <span className="text-gray-300">{subnet.key_insights?.momentum}</span></div>
                      <div><span className="text-blue-300">Dr. Protocol:</span> <span className="text-gray-300">{subnet.key_insights?.dr_protocol}</span></div>
                      <div><span className="text-yellow-300">Ops:</span> <span className="text-gray-300">{subnet.key_insights?.ops}</span></div>
                      <div><span className="text-purple-300">Pulse:</span> <span className="text-gray-300">{subnet.key_insights?.pulse}</span></div>
                      <div className="md:col-span-2"><span className="text-red-300">Guardian:</span> <span className="text-gray-300">{subnet.key_insights?.guardian}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Honorable Mentions */}
            {reportData.honorable_mentions?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-blue-400 mb-4">🎖️ Honorable Mentions</h3>
                <div className="space-y-3">
                  {reportData.honorable_mentions.map((subnet) => (
                    <div key={subnet.subnet_id} className="p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">Subnet {subnet.subnet_id}</span>
                        <span className="text-blue-400">{subnet.overall_score}/100</span>
                      </div>
                      <div className="text-sm text-gray-300 mt-1">
                        Best Agent: <span className="text-blue-300">{subnet.standout_agent?.agent}</span> ({subnet.standout_agent?.score}/100)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Underperformers */}
            {reportData.underperformers?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-red-400 mb-4">⚠️ Underperformers</h3>
                <div className="space-y-3">
                  {reportData.underperformers.map((subnet) => (
                    <div key={subnet.subnet_id} className="p-3 bg-red-900/20 border border-red-700/30 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-semibold">Subnet {subnet.subnet_id}</span>
                        <span className="text-red-400">{subnet.overall_score}/100</span>
                      </div>
                      <div className="text-sm">
                        {subnet.primary_concerns?.map((concern, index) => (
                          <div key={index} className="text-gray-300">
                            {concern.agent}: <span className="text-red-300">{concern.concern}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agent Summaries */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">📊 Agent Analysis Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(reportData.agent_summaries || {}).map(([agentName, summary]) => (
                  <div key={agentName} className="p-4 bg-zinc-800/50 rounded-lg">
                    <h4 className="font-semibold text-white capitalize mb-2">
                      {agentName.replace('_', ' ')} Agent
                    </h4>
                    <div className="text-sm text-gray-300">
                      <div>Average Score: <span className="text-white">{summary.average_score}/100</span></div>
                      <div>Analyzed: <span className="text-white">{summary.total_analyzed} subnets</span></div>
                      <div>Trend: <span className="text-blue-300">{summary.dominant_trend}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 p-4 bg-zinc-800/50 rounded-lg">
              <p className="text-gray-300 text-sm mb-3">
                This is a draft report generated by AI agents. Review the content above and then send to your {stats?.active_subscribers || 0} subscribers.
              </p>
              <div className="flex space-x-4">
                <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white text-sm font-semibold">
                  Send to Subscribers
                </button>
                <button 
                  onClick={handleDownloadReport}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white text-sm font-semibold"
                >
                  Download JSON
                </button>
                <button 
                  onClick={() => setReportData(null)}
                  className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded text-white text-sm font-semibold"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoutBriefAdmin;