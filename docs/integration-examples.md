# Agent Profile Integration Examples

This document provides comprehensive examples of how to integrate the Agent Profile format across all system components in Subnet Scout.

## Table of Contents

1. [Frontend Integration](#frontend-integration)
2. [Backend API Integration](#backend-api-integration)
3. [ScoreAgent Integration](#scoreagent-integration)
4. [Data Transformation Workflows](#data-transformation-workflows)
5. [Mock Server Integration](#mock-server-integration)
6. [External API Integration](#external-api-integration)

## Frontend Integration

### React Component Integration

#### SubnetCard Component

```jsx
// src/components/SubnetCard.jsx
import React from 'react';
import { AgentProfileTransformer } from '../utils/agentProfileTransformer';

const SubnetCard = ({ agentProfile }) => {
  // Transform agent profile to UI format
  const uiData = AgentProfileTransformer.toSubnetCard(agentProfile);
  
  const getStatusColor = (status) => {
    const colors = {
      healthy: 'text-green-600 bg-green-100',
      warning: 'text-yellow-600 bg-yellow-100',
      critical: 'text-red-600 bg-red-100',
      offline: 'text-gray-600 bg-gray-100',
      maintenance: 'text-blue-600 bg-blue-100'
    };
    return colors[status] || colors.offline;
  };

  const getRecommendationBadge = (recommendation) => {
    const badges = {
      strong_buy: { text: 'Strong Buy', color: 'bg-green-500' },
      buy: { text: 'Buy', color: 'bg-green-400' },
      hold: { text: 'Hold', color: 'bg-yellow-500' },
      caution: { text: 'Caution', color: 'bg-orange-500' },
      avoid: { text: 'Avoid', color: 'bg-red-500' }
    };
    return badges[recommendation] || badges.hold;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Subnet {uiData.subnet_id}: {uiData.name}
          </h3>
          <p className="text-sm text-gray-600 capitalize">{uiData.type}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(uiData.status)}`}>
            {uiData.status}
          </span>
          {uiData.recommendation && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getRecommendationBadge(uiData.recommendation).color}`}>
              {getRecommendationBadge(uiData.recommendation).text}
            </span>
          )}
        </div>
      </div>

      {/* Score Display */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Score</span>
          <span className="text-2xl font-bold text-blue-600">{uiData.overall_score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all" 
            style={{ width: `${uiData.overall_score}%` }}
          ></div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">{uiData.yield_score}</div>
          <div className="text-xs text-gray-600">Yield</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">{uiData.activity_score}</div>
          <div className="text-xs text-gray-600">Activity</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">{uiData.credibility_score}</div>
          <div className="text-xs text-gray-600">Credibility</div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Current Yield:</span>
          <span className="font-medium">{uiData.current_yield}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Validators:</span>
          <span className="font-medium">{uiData.validator_count.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Risk Level:</span>
          <span className={`font-medium ${uiData.risk_level === 'low' ? 'text-green-600' : uiData.risk_level === 'high' ? 'text-red-600' : 'text-yellow-600'}`}>
            {uiData.risk_level}
          </span>
        </div>
      </div>

      {/* AI Summary */}
      {uiData.ai_summary && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-700 line-clamp-3">{uiData.ai_summary}</p>
        </div>
      )}

      {/* Last Updated */}
      <div className="mt-4 text-xs text-gray-500">
        Updated: {new Date(uiData.last_updated).toLocaleString()}
      </div>
    </div>
  );
};

export default SubnetCard;
```

#### Custom Hook for Agent Profiles

```jsx
// src/hooks/useAgentProfile.js
import { useState, useEffect } from 'react';
import { agentProfileApi } from '../utils/apiClient';
import { AgentProfileValidator } from '../utils/agentProfileValidator';

export const useAgentProfile = (subnetId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    if (!subnetId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch profile data
        const response = await agentProfileApi.getProfile(subnetId);
        
        // Validate the profile data
        const validator = new AgentProfileValidator();
        const validation = validator.validateProfile(response.data, `subnet-${subnetId}`);
        
        setValidationResult(validation);
        
        if (validation.valid) {
          setProfile(response.data);
        } else {
          console.warn(`Profile validation failed for subnet ${subnetId}:`, validation.errors);
          setProfile(response.data); // Still set profile but log validation issues
        }
        
      } catch (err) {
        setError(err.message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [subnetId]);

  const refreshProfile = () => {
    if (subnetId) {
      fetchProfile();
    }
  };

  return {
    profile,
    loading,
    error,
    validationResult,
    refreshProfile
  };
};

// Usage example
export const useAgentProfiles = (subnetIds = []) => {
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAllProfiles = async () => {
      setLoading(true);
      const profilePromises = subnetIds.map(async (id) => {
        try {
          const response = await agentProfileApi.getProfile(id);
          return { id, data: response.data, error: null };
        } catch (error) {
          return { id, data: null, error: error.message };
        }
      });

      const results = await Promise.all(profilePromises);
      
      const newProfiles = {};
      const newErrors = {};
      
      results.forEach(({ id, data, error }) => {
        if (data) {
          newProfiles[id] = data;
        } else {
          newErrors[id] = error;
        }
      });

      setProfiles(newProfiles);
      setErrors(newErrors);
      setLoading(false);
    };

    if (subnetIds.length > 0) {
      fetchAllProfiles();
    }
  }, [subnetIds]);

  return { profiles, loading, errors };
};
```

## Backend API Integration

### Express Route Handler

```javascript
// backend/routes/agentProfiles.js
const express = require('express');
const router = express.Router();
const AgentProfileService = require('../services/AgentProfileService');
const AgentProfileValidator = require('../utils/AgentProfileValidator');
const { handleAsync } = require('../middleware/errorHandler');

// Get agent profile by subnet ID
router.get('/profile/:subnetId', handleAsync(async (req, res) => {
  const { subnetId } = req.params;
  const { format = 'json', validate = 'true' } = req.query;
  
  // Fetch profile data
  const profile = await AgentProfileService.getProfile(parseInt(subnetId));
  
  if (!profile) {
    return res.status(404).json({
      error: 'Profile not found',
      subnet_id: subnetId
    });
  }
  
  // Validate if requested
  if (validate === 'true') {
    const validator = new AgentProfileValidator();
    const validationResult = validator.validateProfile(profile, `api-subnet-${subnetId}`);
    
    if (!validationResult.valid) {
      console.warn(`Profile validation warnings for subnet ${subnetId}:`, validationResult.errors);
      // Add validation metadata to response
      profile._validation = {
        valid: false,
        errors: validationResult.errors,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  // Return in requested format
  if (format === 'yaml') {
    const yaml = require('js-yaml');
    res.set('Content-Type', 'application/x-yaml');
    return res.send(yaml.dump(profile));
  }
  
  res.json(profile);
}));

// Get multiple profiles
router.post('/profiles/batch', handleAsync(async (req, res) => {
  const { subnet_ids, include_validation = false } = req.body;
  
  if (!Array.isArray(subnet_ids) || subnet_ids.length === 0) {
    return res.status(400).json({
      error: 'subnet_ids must be a non-empty array'
    });
  }
  
  const profiles = await AgentProfileService.getBatchProfiles(subnet_ids);
  
  // Add validation results if requested
  if (include_validation) {
    const validator = new AgentProfileValidator();
    profiles.forEach(profile => {
      if (profile) {
        const validation = validator.validateProfile(profile, `batch-${profile.identity.subnet_id}`);
        profile._validation = validation;
      }
    });
  }
  
  res.json({
    profiles,
    count: profiles.length,
    requested: subnet_ids.length,
    timestamp: new Date().toISOString()
  });
}));

// Update agent profile
router.put('/profile/:subnetId', handleAsync(async (req, res) => {
  const { subnetId } = req.params;
  const profileData = req.body;
  
  // Validate incoming profile data
  const validator = new AgentProfileValidator();
  const validationResult = validator.validateProfile(profileData, `update-${subnetId}`);
  
  if (!validationResult.valid) {
    return res.status(400).json({
      error: 'Profile validation failed',
      validation_errors: validationResult.errors,
      subnet_id: subnetId
    });
  }
  
  // Update profile
  const updatedProfile = await AgentProfileService.updateProfile(parseInt(subnetId), profileData);
  
  res.json({
    success: true,
    profile: updatedProfile,
    updated_at: new Date().toISOString()
  });
}));

module.exports = router;
```

### Service Layer Integration

```javascript
// backend/services/AgentProfileService.js
const AgentProfileTransformer = require('../utils/AgentProfileTransformer');
const ScoreAgent = require('../scoring/ScoreAgent');
const TaoStatsClient = require('../clients/TaoStatsClient');
const IoNetClient = require('../clients/IoNetClient');

class AgentProfileService {
  constructor() {
    this.scoreAgent = new ScoreAgent(process.env.CLAUDE_API_KEY);
    this.taoStatsClient = new TaoStatsClient();
    this.ioNetClient = new IoNetClient();
  }

  /**
   * Get complete agent profile for a subnet
   */
  async getProfile(subnetId) {
    try {
      // Gather data from all sources
      const [metrics, scoreData, additionalData] = await Promise.all([
        this.gatherMetrics(subnetId),
        this.calculatePerformance(subnetId),
        this.gatherAdditionalData(subnetId)
      ]);

      // Transform to agent profile format
      const profile = AgentProfileTransformer.createProfile({
        subnet_id: subnetId,
        metrics,
        scoreData,
        additionalData,
        timestamp: new Date().toISOString()
      });

      return profile;
    } catch (error) {
      console.error(`Error getting profile for subnet ${subnetId}:`, error);
      throw error;
    }
  }

  /**
   * Gather raw metrics from external APIs
   */
  async gatherMetrics(subnetId) {
    const [taoStats, ioNetData] = await Promise.all([
      this.taoStatsClient.getSubnetStats(subnetId),
      this.ioNetClient.getSubnetInfo(subnetId).catch(() => null) // Optional
    ]);

    return {
      emission_rate: taoStats.emission_rate || 0,
      total_stake: taoStats.total_stake || 0,
      validator_count: taoStats.validator_count || 0,
      activity_score: taoStats.activity_score || 0,
      price_history: taoStats.price_history || [],
      block_number: taoStats.block_number || 0,
      network_participation: this.calculateNetworkParticipation(taoStats)
    };
  }

  /**
   * Calculate performance scores using ScoreAgent
   */
  async calculatePerformance(subnetId) {
    const metrics = await this.gatherMetrics(subnetId);
    return await this.scoreAgent.calculateScore(subnetId, metrics);
  }

  /**
   * Gather additional subnet data
   */
  async gatherAdditionalData(subnetId) {
    // This would fetch subnet metadata, description, links, etc.
    // For now, return basic data
    return {
      name: `Subnet ${subnetId}`,
      type: 'inference', // Would be determined from subnet registry
      description: `Performance analysis for subnet ${subnetId}`,
      tags: ['bittensor', 'subnet'],
      website: null,
      github: null
    };
  }

  /**
   * Calculate network participation percentage
   */
  calculateNetworkParticipation(stats) {
    const totalPossibleValidators = 500; // Approximate max validators per subnet
    return Math.min(100, (stats.validator_count / totalPossibleValidators) * 100);
  }

  /**
   * Get batch profiles efficiently
   */
  async getBatchProfiles(subnetIds) {
    const profilePromises = subnetIds.map(async (id) => {
      try {
        return await this.getProfile(id);
      } catch (error) {
        console.error(`Error fetching profile for subnet ${id}:`, error);
        return null;
      }
    });

    return Promise.all(profilePromises);
  }

  /**
   * Update agent profile
   */
  async updateProfile(subnetId, profileData) {
    // In a real implementation, this would update the database
    // For now, just return the updated profile with new timestamp
    return {
      ...profileData,
      metadata: {
        ...profileData.metadata,
        updated_at: new Date().toISOString()
      }
    };
  }
}

module.exports = AgentProfileService;
``` 