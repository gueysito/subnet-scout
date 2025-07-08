/**
 * AITable.ai API integration for newsletter subscription management
 * Handles email capture and storage for Subnet Scout newsletter
 */

class AITableService {
  constructor() {
    this.baseUrl = 'https://aitable.ai/fusion/v1';
    this.tableName = 'subnet scout subscribers';
    this.initialized = false;
    
    // Initialize immediately if environment variables are available
    this.init();
  }
  
  init() {
    this.apiKey = process.env.AITABLE_API_KEY;
    this.datasheetId = process.env.AITABLE_DATASHEET_ID;
    
    if (!this.apiKey) {
      console.warn('⚠️ AITable API key not found in environment variables');
    } else if (!this.datasheetId) {
      console.warn('⚠️ AITable datasheet ID not found in environment variables');
    } else {
      console.log('📊 AITable service initialized for newsletter management');
      console.log(`🆔 Using datasheet: ${this.datasheetId}`);
      this.initialized = true;
    }
  }

  /**
   * Find the first empty row in the datasheet
   * @returns {Promise<string|null>} Record ID of first empty row, or null if none found
   */
  async findFirstEmptyRow() {
    try {
      // Get all records from the datasheet
      const response = await fetch(`${this.baseUrl}/datasheets/${this.datasheetId}/records?pageSize=1000`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn('⚠️ Could not fetch records to find empty rows');
        return null;
      }

      const result = await response.json();
      const records = result.data?.records || [];

      // Find first record with empty email field
      const emptyRow = records.find(record => 
        !record.fields?.email || 
        record.fields.email === '' || 
        record.fields.email === null
      );

      return emptyRow ? emptyRow.recordId : null;

    } catch (error) {
      console.warn('⚠️ Error finding empty row:', error.message);
      return null;
    }
  }

  /**
   * Add a subscriber email to the newsletter list
   * @param {string} email - The subscriber's email address
   * @param {object} metadata - Additional metadata (optional)
   * @returns {Promise<object>} Success/failure response
   */
  async addSubscriber(email, metadata = {}) {
    try {
      // Re-initialize if not already initialized
      if (!this.initialized) {
        this.init();
      }
      
      if (!this.apiKey) {
        throw new Error('AITable API key not configured');
      }
      
      if (!this.datasheetId) {
        throw new Error('AITable datasheet ID not configured');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // Prepare the record data
      const recordData = {
        email: email,
        subscribed_at: new Date().toISOString(),
        source: 'subnet_scout_website',
        status: 'active',
        ...metadata
      };

      // First, try to find an empty row to fill
      const emptyRowId = await this.findFirstEmptyRow();
      
      let response;
      let operationType;
      
      if (emptyRowId) {
        // Update existing empty row
        console.log(`📝 Filling empty row ${emptyRowId} with email: ${email}`);
        operationType = 'UPDATE';
        response = await fetch(`${this.baseUrl}/datasheets/${this.datasheetId}/records`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            records: [{
              recordId: emptyRowId,
              fields: recordData
            }]
          })
        });
      } else {
        // Create new record if no empty rows found
        console.log(`➕ Creating new row for email: ${email}`);
        operationType = 'CREATE';
        response = await fetch(`${this.baseUrl}/datasheets/${this.datasheetId}/records`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            records: [{
              fields: recordData
            }]
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`AITable API Error ${response.status}: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      const recordId = emptyRowId || result.data?.records?.[0]?.recordId;
      
      console.log(`✅ Newsletter subscriber ${operationType === 'UPDATE' ? 'updated' : 'added'} successfully:`, email);
      return {
        success: true,
        email: email,
        recordId: recordId,
        operationType: operationType,
        message: 'Successfully subscribed to newsletter'
      };

    } catch (error) {
      console.error('❌ Failed to add newsletter subscriber:', error.message);
      console.error('Error details:', error);
      
      throw error;
    }
  }

  /**
   * Check if an email is already subscribed
   * @param {string} email - The email address to check
   * @returns {Promise<boolean>} True if already subscribed
   */
  async isSubscribed(email) {
    try {
      // Re-initialize if not already initialized
      if (!this.initialized) {
        this.init();
      }
      
      if (!this.apiKey || !this.datasheetId) {
        return false;
      }

      // Query the datasheet to check for existing email
      const response = await fetch(`${this.baseUrl}/datasheets/${this.datasheetId}/records?filterByFormula=email="${email}"`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn('⚠️ Could not check subscription status:', response.statusText);
        return false;
      }

      const result = await response.json();
      return result.data?.records?.length > 0;

    } catch (error) {
      console.warn('⚠️ Could not check subscription status:', error.message);
      return false;
    }
  }

  /**
   * Get subscription statistics
   * @returns {Promise<object>} Subscription stats
   */
  async getStats() {
    try {
      if (!this.apiKey) {
        return { total: 0, demo: true };
      }

      // In development mode, return mock stats
      if (process.env.NODE_ENV === 'development') {
        return {
          total: Math.floor(Math.random() * 500) + 100,
          today: Math.floor(Math.random() * 10) + 1,
          demo: true
        };
      }

      // Real implementation would query the AITable for stats
      return { total: 0 };

    } catch (error) {
      console.warn('⚠️ Could not fetch subscription stats:', error.message);
      return { total: 0, error: true };
    }
  }
}

// Create singleton instance
const aitableService = new AITableService();

export default aitableService;