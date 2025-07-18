import React, { useState, useEffect } from 'react';
import { Shield, Users, FileText, Send, Eye, EyeOff } from 'lucide-react';
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

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.get('/api/scoutbrief/admin/status');
        if (response.authenticated) {
          setIsAuthenticated(true);
          fetchStats();
        }
      } catch (error) {
        console.warn('Auth check failed:', error.message);
      }
    };
    checkAuth();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/scoutbrief/admin/stats');
      setStats(response);
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
        fetchStats();
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
        fetchStats();
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
            onClick={fetchStats}
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
      </div>
    </div>
  );
};

export default ScoutBriefAdmin;