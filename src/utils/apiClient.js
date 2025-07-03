// Central API client that switches between mock and real endpoints
const API_CONFIG = {
  // FORCE MOCK MODE FOR TESTING - Easy override
  USE_MOCK: true, // Temporarily forced for testing
  
  // Mock endpoints (local mock server)
  MOCK_BASE_URL: 'http://localhost:3001',
  
  // Real API endpoints
  IONET_BASE_URL: 'https://api.io.net',
  TAOSTATS_BASE_URL: 'https://api.taostats.io',
  BACKEND_BASE_URL: 'http://localhost:8080',
  
  // API Keys
  IONET_API_KEY: import.meta.env.VITE_IONET_API_KEY,
  TAOSTATS_USERNAME: import.meta.env.VITE_TAOSTATS_USERNAME,
  TAOSTATS_PASSWORD: import.meta.env.VITE_TAOSTATS_PASSWORD,
};

class ApiClient {
  constructor() {
    this.useMock = API_CONFIG.USE_MOCK;
    console.log(`🔧 API Client initialized - Using ${this.useMock ? 'MOCK' : 'REAL'} APIs`);
    console.log(`🔗 Mock server URL: ${API_CONFIG.MOCK_BASE_URL}`);
  }

  // Generic fetch wrapper with error handling
  async fetchWithErrorHandling(url, options = {}) {
    try {
      console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `API Error ${response.status}: ${errorData.error?.message || response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`✅ API Response: ${url} - Success`);
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${url} -`, error.message);
      throw error;
    }
  }

  // 1. io.net API calls
  async getIoNetAgents() {
    const url = this.useMock 
      ? `${API_CONFIG.MOCK_BASE_URL}/api/ionet/agents`
      : `${API_CONFIG.IONET_BASE_URL}/v1/agents`;
    
    const headers = this.useMock 
      ? {}
      : { 'Authorization': `Bearer ${API_CONFIG.IONET_API_KEY}` };

    return this.fetchWithErrorHandling(url, { headers });
  }

  // 2. TaoStats API calls
  async getTaoStatsData(netuid = 1, options = {}) {
    const { page = 1, limit = 10, blockStart, blockEnd } = options;
    
    let url, headers;
    
    if (this.useMock) {
      url = `${API_CONFIG.MOCK_BASE_URL}/api/taostats/pool/history?netuid=${netuid}&page=${page}&limit=${limit}`;
      headers = { 'Authorization': 'mock:credentials' };
    } else {
      const params = new URLSearchParams({
        netuid: netuid.toString(),
        frequency: 'by_hour',
        page: page.toString(),
        order: 'block_number_desc'
      });
      
      if (blockStart) params.append('block_start', blockStart.toString());
      if (blockEnd) params.append('block_end', blockEnd.toString());
      
      url = `${API_CONFIG.TAOSTATS_BASE_URL}/api/dtao/pool/history/v1?${params}`;
      headers = { 
        'Authorization': `${API_CONFIG.TAOSTATS_USERNAME}:${API_CONFIG.TAOSTATS_PASSWORD}`,
        'Accept': 'application/json'
      };
    }

    return this.fetchWithErrorHandling(url, { headers });
  }

  // 3. Internal scoring API calls - SIMPLIFIED (removed Ask Claude)
  async calculateScore(subnetId, metrics, timeframe = '24h') {
    const url = this.useMock
      ? `${API_CONFIG.MOCK_BASE_URL}/api/score/enhanced`
      : `${API_CONFIG.BACKEND_BASE_URL}/api/score/enhanced`;

    const body = {
      subnet_id: subnetId,
      metrics,
      timeframe
    };

    return this.fetchWithErrorHandling(url, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  async getAgentsList(page = 1, limit = 20) {
    const url = this.useMock
      ? `${API_CONFIG.MOCK_BASE_URL}/api/agents?page=${page}&limit=${limit}`
      : `${API_CONFIG.BACKEND_BASE_URL}/api/agents?page=${page}&limit=${limit}`;

    return this.fetchWithErrorHandling(url);
  }

  // 4. Telegram webhook (for testing)
  async sendTelegramMessage(message) {
    const url = this.useMock
      ? `${API_CONFIG.MOCK_BASE_URL}/webhook/telegram`
      : `${API_CONFIG.BACKEND_BASE_URL}/webhook/telegram`;

    const body = {
      update_id: Date.now(),
      message: {
        message_id: Date.now(),
        from: { id: 123, username: 'test_user', first_name: 'Test' },
        chat: { id: 123, type: 'private' },
        date: Math.floor(Date.now() / 1000),
        text: message
      }
    };

    return this.fetchWithErrorHandling(url, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  // 5. Health check
  async healthCheck() {
    const url = this.useMock
      ? `${API_CONFIG.MOCK_BASE_URL}/health`
      : `${API_CONFIG.BACKEND_BASE_URL}/health`;

    return this.fetchWithErrorHandling(url);
  }

  // Generic GET method for any endpoint
  async get(endpoint) {
    // If endpoint starts with slash, treat as relative to mock server
    // Otherwise, treat as absolute URL
    const url = endpoint.startsWith('/') 
      ? `${API_CONFIG.MOCK_BASE_URL}${endpoint}`
      : endpoint;

    return this.fetchWithErrorHandling(url);
  }

  // Utility methods
  toggleMockMode() {
    this.useMock = !this.useMock;
    console.log(`🔄 API Client switched to ${this.useMock ? 'MOCK' : 'REAL'} mode`);
  }

  getCurrentMode() {
    return this.useMock ? 'mock' : 'real';
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Export both the class and instance
export default apiClient;
export { ApiClient, API_CONFIG }; 