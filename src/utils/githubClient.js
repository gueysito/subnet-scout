/**
 * GitHub API Client for Repository Statistics
 * Handles rate limiting, error recovery, and batch operations
 */

import { getSubnetGithubUrl } from '../data/subnets.js';

class GitHubClient {
  constructor(apiToken = null) {
    this.apiToken = apiToken || process.env.GITHUB_TOKEN;
    this.baseUrl = 'https://api.github.com';
    this.rateLimitRemaining = 5000;
    this.rateLimitReset = null;
    this.requestQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Make authenticated GitHub API request with rate limiting
   */
  async makeRequest(endpoint, options = {}) {
    if (!this.apiToken) {
      throw new Error('GitHub API token not configured');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `token ${this.apiToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'SubnetScout-Monitor/1.0',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      // Update rate limit info
      this.rateLimitRemaining = parseInt(response.headers.get('X-RateLimit-Remaining') || '0');
      this.rateLimitReset = parseInt(response.headers.get('X-RateLimit-Reset') || '0');

      if (!response.ok) {
        if (response.status === 403 && this.rateLimitRemaining === 0) {
          throw new Error(`GitHub API rate limit exceeded. Resets at ${new Date(this.rateLimitReset * 1000)}`);
        }
        if (response.status === 404) {
          throw new Error(`Repository not found: ${endpoint}`);
        }
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`GitHub API request failed for ${endpoint}:`, error.message);
      throw error;
    }
  }

  /**
   * Extract owner and repo from GitHub URL
   */
  extractRepoInfo(githubUrl) {
    try {
      const url = new URL(githubUrl);
      const pathParts = url.pathname.split('/').filter(part => part);
      
      if (pathParts.length >= 2) {
        return {
          owner: pathParts[0],
          repo: pathParts[1],
          fullName: `${pathParts[0]}/${pathParts[1]}`
        };
      }
      throw new Error('Invalid GitHub URL format');
    } catch (error) {
      throw new Error(`Failed to parse GitHub URL: ${githubUrl}`);
    }
  }

  /**
   * Get repository commit activity for last 30 days
   */
  async getCommitActivity(githubUrl, days = 30) {
    try {
      const { owner, repo, fullName } = this.extractRepoInfo(githubUrl);
      const since = new Date();
      since.setDate(since.getDate() - days);
      
      const endpoint = `/repos/${owner}/${repo}/commits`;
      const params = new URLSearchParams({
        since: since.toISOString(),
        per_page: '100' // Maximum per page
      });

      const commits = await this.makeRequest(`${endpoint}?${params}`);
      
      return {
        repository: fullName,
        commits_last_30_days: commits.length,
        last_commit_date: commits.length > 0 ? commits[0].commit.author.date : null,
        last_commit_message: commits.length > 0 ? commits[0].commit.message.split('\n')[0] : null,
        last_commit_author: commits.length > 0 ? commits[0].commit.author.name : null
      };
    } catch (error) {
      return {
        repository: githubUrl,
        commits_last_30_days: 0,
        last_commit_date: null,
        last_commit_message: null,
        last_commit_author: null,
        error: error.message
      };
    }
  }

  /**
   * Get repository statistics (stars, forks, contributors)
   */
  async getRepositoryStats(githubUrl) {
    try {
      const { owner, repo, fullName } = this.extractRepoInfo(githubUrl);
      
      const [repoData, contributors] = await Promise.all([
        this.makeRequest(`/repos/${owner}/${repo}`),
        this.makeRequest(`/repos/${owner}/${repo}/contributors?per_page=100`).catch(() => [])
      ]);

      return {
        repository: fullName,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        watchers: repoData.watchers_count,
        open_issues: repoData.open_issues_count,
        contributors_count: contributors.length,
        language: repoData.language,
        created_at: repoData.created_at,
        updated_at: repoData.updated_at,
        description: repoData.description
      };
    } catch (error) {
      return {
        repository: githubUrl,
        stars: 0,
        forks: 0,
        watchers: 0,
        open_issues: 0,
        contributors_count: 0,
        language: null,
        created_at: null,
        updated_at: null,
        description: null,
        error: error.message
      };
    }
  }

  /**
   * Get comprehensive repository analysis
   */
  async getRepositoryAnalysis(githubUrl) {
    try {
      const [commitActivity, repoStats] = await Promise.all([
        this.getCommitActivity(githubUrl),
        this.getRepositoryStats(githubUrl)
      ]);

      return {
        ...commitActivity,
        ...repoStats,
        activity_score: this.calculateActivityScore(commitActivity, repoStats),
        health_score: this.calculateHealthScore(commitActivity, repoStats)
      };
    } catch (error) {
      return {
        repository: githubUrl,
        error: error.message,
        activity_score: 0,
        health_score: 0
      };
    }
  }

  /**
   * Calculate activity score based on commits and engagement
   */
  calculateActivityScore(commitData, repoData) {
    let score = 0;
    
    // Commit activity (40% weight)
    const commitsScore = Math.min(100, (commitData.commits_last_30_days || 0) * 2);
    score += commitsScore * 0.4;
    
    // Repository engagement (30% weight)
    const engagementScore = Math.min(100, ((repoData.stars || 0) + (repoData.forks || 0)) / 10);
    score += engagementScore * 0.3;
    
    // Contributors (20% weight)
    const contributorsScore = Math.min(100, (repoData.contributors_count || 0) * 10);
    score += contributorsScore * 0.2;
    
    // Recency (10% weight)
    const recencyScore = commitData.last_commit_date ? 
      Math.max(0, 100 - ((Date.now() - new Date(commitData.last_commit_date)) / (1000 * 60 * 60 * 24))) : 0;
    score += recencyScore * 0.1;
    
    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * Calculate repository health score
   */
  calculateHealthScore(commitData, repoData) {
    let score = 0;
    
    // Recent activity (50% weight)
    const hasRecentCommits = commitData.commits_last_30_days > 0;
    score += hasRecentCommits ? 50 : 0;
    
    // Community engagement (30% weight)
    const hasEngagement = (repoData.stars > 0) || (repoData.forks > 0) || (repoData.contributors_count > 1);
    score += hasEngagement ? 30 : 0;
    
    // Documentation (20% weight)
    const hasDescription = repoData.description && repoData.description.length > 0;
    score += hasDescription ? 20 : 0;
    
    return score;
  }

  /**
   * Get batch analysis for multiple subnets with rate limiting
   */
  async getBatchSubnetActivity(subnetIds, maxConcurrent = 5) {
    const results = {};
    const chunks = [];
    
    // Split into chunks to respect rate limits
    for (let i = 0; i < subnetIds.length; i += maxConcurrent) {
      chunks.push(subnetIds.slice(i, i + maxConcurrent));
    }

    console.log(`🔍 Analyzing GitHub activity for ${subnetIds.length} subnets in ${chunks.length} batches...`);

    for (const [chunkIndex, chunk] of chunks.entries()) {
      console.log(`   Processing batch ${chunkIndex + 1}/${chunks.length} (${chunk.length} subnets)...`);
      
      const chunkPromises = chunk.map(async (subnetId) => {
        try {
          const githubUrl = getSubnetGithubUrl(subnetId);
          const analysis = await this.getRepositoryAnalysis(githubUrl);
          
          return {
            subnet_id: subnetId,
            github_url: githubUrl,
            ...analysis
          };
        } catch (error) {
          return {
            subnet_id: subnetId,
            github_url: getSubnetGithubUrl(subnetId),
            error: error.message,
            commits_last_30_days: 0,
            activity_score: 0,
            health_score: 0
          };
        }
      });

      const chunkResults = await Promise.all(chunkPromises);
      
      // Add results to final object
      chunkResults.forEach(result => {
        results[result.subnet_id] = result;
      });

      // Rate limiting: wait between chunks if needed
      if (chunkIndex < chunks.length - 1 && this.rateLimitRemaining < 100) {
        console.log(`   ⏳ Rate limit low (${this.rateLimitRemaining}), waiting 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return {
      results,
      summary: {
        total_analyzed: subnetIds.length,
        successful: Object.values(results).filter(r => !r.error).length,
        failed: Object.values(results).filter(r => r.error).length,
        rate_limit_remaining: this.rateLimitRemaining,
        average_activity_score: this.calculateAverageScore(results, 'activity_score')
      }
    };
  }

  /**
   * Calculate average score from results
   */
  calculateAverageScore(results, scoreField) {
    const scores = Object.values(results)
      .map(r => r[scoreField] || 0)
      .filter(score => score > 0);
    
    return scores.length > 0 ? 
      Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus() {
    return {
      remaining: this.rateLimitRemaining,
      reset_time: new Date(this.rateLimitReset * 1000),
      reset_in_minutes: Math.round((this.rateLimitReset * 1000 - Date.now()) / (1000 * 60))
    };
  }
}

export default GitHubClient; 