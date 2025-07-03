import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Server,
  Database,
  Shield,
  Cpu,
  Memory,
  HardDrive,
  Wifi,
  AlertCircle,
  TrendingUp,
  Zap,
  Globe,
  GitHub,
  Brain,
  Eye
} from 'lucide-react';

const HealthDashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch health data from backend
  const fetchHealthData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8080/health');
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      const data = await response.json();
      setHealthData(data);
      setLastUpdate(new Date());
      
    } catch (err) {
      console.error('Health check failed:', err);
      setError(err.message);
      
      // Fallback to mock data for demonstration
      const mockData = {
        overall_status: 'healthy',
        services_up: 7,
        services_degraded: 1,
        services_down: 0,
        total_services: 8,
        services: [
          { name: 'cache', status: 'up', response_time: '12ms', last_check: new Date().toISOString() },
          { name: 'anthropic_api', status: 'up', response_time: '45ms', last_check: new Date().toISOString() },
          { name: 'ionet_api', status: 'up', response_time: '78ms', last_check: new Date().toISOString() },
          { name: 'github_api', status: 'up', response_time: '34ms', last_check: new Date().toISOString() },
          { name: 'kaito_yaps', status: 'degraded', response_time: '156ms', last_check: new Date().toISOString() },
          { name: 'ethos_network', status: 'up', response_time: '67ms', last_check: new Date().toISOString() },
          { name: 'filesystem', status: 'up', response_time: '3ms', last_check: new Date().toISOString() },
          { name: 'memory', status: 'up', response_time: '1ms', last_check: new Date().toISOString() }
        ],
        total_check_time: '356ms',
        timestamp: new Date().toISOString(),
        metrics: {
          performance: {
            avg_response_time: 54,
            p95_response_time: 156,
            error_rate: '2.3%'
          },
          security: {
            blocked_requests: 12,
            suspicious_activities: 0,
            failed_authentications: 3
          },
          resources: {
            memory_usage: 234,
            cpu_usage: 45,
            disk_usage: 'available'
          }
        },
        system_info: {
          node_version: 'v18.17.0',
          platform: 'darwin',
          uptime: '2d 14h 32m 18s',
          load_average: '34.2%'
        }
      };
      
      setHealthData(mockData);
      setLastUpdate(new Date());
      
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    fetchHealthData();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchHealthData, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // Service status icon helper
  const getServiceIcon = (serviceName) => {
    const icons = {
      cache: Database,
      anthropic_api: Brain,
      ionet_api: Zap,
      github_api: GitHub,
      kaito_yaps: Globe,
      ethos_network: Shield,
      filesystem: HardDrive,
      memory: Memory,
      database: Server
    };
    return icons[serviceName] || Activity;
  };

  // Status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'up': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'down': return 'text-red-500';
      case 'disabled': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  // Status background helper
  const getStatusBg = (status) => {
    switch (status) {
      case 'up': return 'bg-green-50 border-green-200';
      case 'degraded': return 'bg-yellow-50 border-yellow-200';
      case 'down': return 'bg-red-50 border-red-200';
      case 'disabled': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  // Overall status helper
  const getOverallStatus = () => {
    if (!healthData) return { status: 'unknown', color: 'text-gray-500', bg: 'bg-gray-50' };
    
    switch (healthData.overall_status) {
      case 'healthy': return { status: 'All Systems Operational', color: 'text-green-600', bg: 'bg-green-50' };
      case 'degraded': return { status: 'Some Services Degraded', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      case 'unhealthy': return { status: 'System Issues Detected', color: 'text-red-600', bg: 'bg-red-50' };
      default: return { status: 'Status Unknown', color: 'text-gray-500', bg: 'bg-gray-50' };
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-8 py-16">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm"
            >
              <Activity className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-5xl font-bold text-white mb-4">
              System Health Dashboard
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Real-time monitoring of all Subnet Scout services, infrastructure, and performance metrics
            </p>

            {/* Overall Status Banner */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`inline-flex items-center px-8 py-4 rounded-full backdrop-blur-sm border ${
                healthData?.overall_status === 'healthy' 
                  ? 'bg-green-500/20 border-green-400/30 text-green-100'
                  : healthData?.overall_status === 'degraded'
                  ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-100'
                  : 'bg-red-500/20 border-red-400/30 text-red-100'
              }`}
            >
              {healthData?.overall_status === 'healthy' && <CheckCircle className="w-6 h-6 mr-3" />}
              {healthData?.overall_status === 'degraded' && <AlertTriangle className="w-6 h-6 mr-3" />}
              {healthData?.overall_status === 'unhealthy' && <XCircle className="w-6 h-6 mr-3" />}
              <span className="text-lg font-semibold">{overallStatus.status}</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
                </span>
              </div>
              
              {healthData && (
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Services: {healthData.services_up} up, {healthData.services_degraded} degraded, {healthData.services_down} down</span>
                  <span>•</span>
                  <span>Check time: {healthData.total_check_time}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  autoRefresh 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}</span>
              </button>
              
              <button
                onClick={fetchHealthData}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <motion.div
                  animate={{ rotate: loading ? 360 : 0 }}
                  transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: 'linear' }}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                <span>{loading ? 'Refreshing...' : 'Refresh Now'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8"
          >
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Connection Error</h3>
                <p className="text-red-600 mt-1">{error}</p>
                <p className="text-sm text-red-500 mt-2">Showing demo data for visualization purposes.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Services Grid */}
        {healthData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          >
            {healthData.services.map((service, index) => {
              const IconComponent = getServiceIcon(service.name);
              return (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`p-6 rounded-xl border shadow-sm ${getStatusBg(service.status)}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${service.status === 'up' ? 'bg-green-100' : service.status === 'degraded' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                        <IconComponent className={`w-5 h-5 ${getStatusColor(service.status)}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {service.name.replace(/_/g, ' ')}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {service.response_time || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      service.status === 'up' ? 'bg-green-100 text-green-800' :
                      service.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                      service.status === 'down' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {service.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Last check: {new Date(service.last_check).toLocaleTimeString()}
                  </div>
                  
                  {service.error && (
                    <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-700">
                      {service.error}
                    </div>
                  )}
                  
                  {service.details && (
                    <div className="mt-2 text-xs text-gray-600">
                      {Object.entries(service.details).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                          <span>{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* System Metrics */}
        {healthData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-900">Performance Metrics</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {healthData.metrics?.performance?.avg_response_time || 'N/A'}
                    <span className="text-sm text-blue-500 ml-1">ms</span>
                  </div>
                  <div className="text-sm text-blue-600">Avg Response Time</div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {healthData.metrics?.performance?.p95_response_time || 'N/A'}
                    <span className="text-sm text-purple-500 ml-1">ms</span>
                  </div>
                  <div className="text-sm text-purple-600">95th Percentile</div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {healthData.metrics?.performance?.error_rate || 'N/A'}
                  </div>
                  <div className="text-sm text-green-600">Error Rate</div>
                </div>
              </div>
            </motion.div>

            {/* Resource Usage */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Cpu className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-semibold text-gray-900">Resource Usage</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Memory className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Memory Usage</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {healthData.metrics?.resources?.memory_usage || 'N/A'} MB
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Cpu className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">CPU Usage</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {healthData.metrics?.resources?.cpu_usage || 'N/A'} ms
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <HardDrive className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Disk Status</span>
                  </div>
                  <span className="font-semibold text-gray-900 capitalize">
                    {healthData.metrics?.resources?.disk_usage || 'N/A'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* System Information */}
        {healthData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Server className="w-6 h-6 text-indigo-500" />
              <h3 className="text-xl font-semibold text-gray-900">System Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {healthData.system_info?.node_version || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Node.js Version</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 capitalize">
                  {healthData.system_info?.platform || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Platform</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {healthData.system_info?.uptime || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {healthData.system_info?.load_average || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Load Average</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HealthDashboard; 