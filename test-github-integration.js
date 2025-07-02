/**
 * GitHub Activity Monitoring Integration Tests
 * Tests GitHub API client, backend endpoints, and data processing
 */

import GitHubClient from './src/utils/githubClient.js';
import { getSubnetMetadata, getSubnetGithubUrl } from './src/data/subnets.js';
import dotenv from 'dotenv';
import { performance } from 'perf_hooks';

// Load environment variables
dotenv.config();

class GitHubIntegrationTester {
  constructor() {
    this.githubClient = new GitHubClient(process.env.GITHUB_TOKEN);
    this.backendUrl = 'http://localhost:8080';
    this.testResults = {
      total: 0,
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  /**
   * Run test with error handling and result tracking
   */
  async runTest(testName, testFunction) {
    this.testResults.total++;
    console.log(`\n🧪 Testing: ${testName}`);
    
    try {
      const startTime = performance.now();
      await testFunction();
      const endTime = performance.now();
      
      console.log(`   ✅ PASSED (${Math.round(endTime - startTime)}ms)`);
      this.testResults.passed++;
      return true;
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      this.testResults.failed++;
      this.testResults.errors.push({ test: testName, error: error.message });
      return false;
    }
  }

  /**
   * Test 1: Subnet metadata and GitHub URL resolution
   */
  async testSubnetMetadata() {
    // Test known subnets
    const knownSubnets = [1, 5, 8, 21];
    for (const subnetId of knownSubnets) {
      const metadata = getSubnetMetadata(subnetId);
      if (!metadata.name || !metadata.github || !metadata.type) {
        throw new Error(`Missing metadata for subnet ${subnetId}`);
      }
      
      const githubUrl = getSubnetGithubUrl(subnetId);
      if (!githubUrl.startsWith('https://github.com/')) {
        throw new Error(`Invalid GitHub URL for subnet ${subnetId}: ${githubUrl}`);
      }
    }

    // Test generated subnets
    const generatedSubnets = [50, 75, 100, 118];
    for (const subnetId of generatedSubnets) {
      const metadata = getSubnetMetadata(subnetId);
      if (!metadata.name || !metadata.github) {
        throw new Error(`Missing generated metadata for subnet ${subnetId}`);
      }
    }

    console.log(`   📋 Verified metadata for ${knownSubnets.length + generatedSubnets.length} subnets`);
  }

  /**
   * Test 2: GitHub API client functionality
   */
  async testGitHubClientBasics() {
    if (!this.githubClient.apiToken) {
      throw new Error('GitHub API token not configured');
    }

    // Test URL parsing
    const testUrl = 'https://github.com/macrocosm-os/prompting';
    const repoInfo = this.githubClient.extractRepoInfo(testUrl);
    
    if (repoInfo.owner !== 'macrocosm-os' || repoInfo.repo !== 'prompting') {
      throw new Error(`URL parsing failed: expected macrocosm-os/prompting, got ${repoInfo.fullName}`);
    }

    // Test rate limit status
    const rateLimitStatus = this.githubClient.getRateLimitStatus();
    if (typeof rateLimitStatus.remaining !== 'number') {
      throw new Error('Rate limit status not properly initialized');
    }

    console.log(`   🔗 URL parsing working, rate limit: ${rateLimitStatus.remaining} requests remaining`);
  }

  /**
   * Test 3: GitHub repository analysis for real subnet
   */
  async testRealRepositoryAnalysis() {
    // Use a known real repository (subnet 1 - Text Prompting)
    const subnetId = 1;
    const githubUrl = getSubnetGithubUrl(subnetId);
    
    const analysis = await this.githubClient.getRepositoryAnalysis(githubUrl);
    
    if (!analysis.repository || typeof analysis.commits_last_30_days !== 'number') {
      throw new Error(`Invalid analysis result for ${githubUrl}`);
    }

    if (typeof analysis.activity_score !== 'number' || analysis.activity_score < 0 || analysis.activity_score > 100) {
      throw new Error(`Invalid activity score: ${analysis.activity_score}`);
    }

    console.log(`   📊 Analyzed ${analysis.repository}: ${analysis.commits_last_30_days} commits, activity: ${analysis.activity_score}/100`);
    if (analysis.error) {
      console.log(`   ⚠️  Warning: ${analysis.error}`);
    }
  }

  /**
   * Test 4: Batch subnet analysis
   */
  async testBatchAnalysis() {
    const testSubnets = [1, 5, 8]; // Test with 3 subnets to respect rate limits
    
    const batchResult = await this.githubClient.getBatchSubnetActivity(testSubnets, 2);
    
    if (!batchResult.results || !batchResult.summary) {
      throw new Error('Invalid batch result structure');
    }

    if (batchResult.summary.total_analyzed !== testSubnets.length) {
      throw new Error(`Expected to analyze ${testSubnets.length} subnets, got ${batchResult.summary.total_analyzed}`);
    }

    // Verify each subnet has results
    for (const subnetId of testSubnets) {
      if (!batchResult.results[subnetId]) {
        throw new Error(`Missing results for subnet ${subnetId}`);
      }
    }

    console.log(`   📦 Batch analysis: ${batchResult.summary.successful}/${batchResult.summary.total_analyzed} successful, avg activity: ${batchResult.summary.average_activity_score}/100`);
  }

  /**
   * Test 5: Backend API endpoint - individual subnet
   */
  async testBackendIndividualEndpoint() {
    const subnetId = 1;
    const response = await fetch(`${this.backendUrl}/api/github-stats/${subnetId}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 503 && errorData.error?.code === 'GITHUB_API_UNAVAILABLE') {
        console.log(`   ⚠️  GitHub API not configured on backend - this is expected in some environments`);
        return; // Skip this test if GitHub API is not configured
      }
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.github_stats) {
      throw new Error('Invalid backend response structure');
    }

    if (data.subnet_id !== subnetId) {
      throw new Error(`Expected subnet ${subnetId}, got ${data.subnet_id}`);
    }

    console.log(`   🌐 Backend API: ${data.github_stats.commits_last_30_days} commits for subnet ${subnetId}`);
  }

  /**
   * Test 6: Backend API endpoint - batch request
   */
  async testBackendBatchEndpoint() {
    const testSubnets = [1, 5];
    const response = await fetch(`${this.backendUrl}/api/github-stats/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subnet_ids: testSubnets, max_concurrent: 2 })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 503 && errorData.error?.code === 'GITHUB_API_UNAVAILABLE') {
        console.log(`   ⚠️  GitHub API not configured on backend - this is expected in some environments`);
        return; // Skip this test if GitHub API is not configured
      }
      throw new Error(`Backend batch API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.results || !data.summary) {
      throw new Error('Invalid backend batch response structure');
    }

    if (Object.keys(data.results).length !== testSubnets.length) {
      throw new Error(`Expected ${testSubnets.length} results, got ${Object.keys(data.results).length}`);
    }

    console.log(`   🌐 Backend batch API: ${data.summary.successful}/${data.summary.total_analyzed} successful`);
  }

  /**
   * Test 7: Backend API endpoint - paginated request
   */
  async testBackendPaginatedEndpoint() {
    const response = await fetch(`${this.backendUrl}/api/github-stats?limit=3&offset=0`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 503 && errorData.error?.code === 'GITHUB_API_UNAVAILABLE') {
        console.log(`   ⚠️  GitHub API not configured on backend - this is expected in some environments`);
        return; // Skip this test if GitHub API is not configured
      }
      throw new Error(`Backend paginated API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.results || !data.pagination) {
      throw new Error('Invalid backend paginated response structure');
    }

    if (data.pagination.limit !== 3 || data.pagination.offset !== 0) {
      throw new Error(`Pagination mismatch: expected limit=3, offset=0, got limit=${data.pagination.limit}, offset=${data.pagination.offset}`);
    }

    console.log(`   🌐 Backend paginated API: ${data.summary.total_analyzed} subnets analyzed, ${data.summary.successful} successful`);
  }

  /**
   * Test 8: Error handling for invalid requests
   */
  async testErrorHandling() {
    // Test invalid subnet ID
    const invalidResponse = await fetch(`${this.backendUrl}/api/github-stats/999`);
    if (invalidResponse.status !== 400) {
      throw new Error(`Expected 400 for invalid subnet ID, got ${invalidResponse.status}`);
    }

    // Test invalid batch request
    const batchResponse = await fetch(`${this.backendUrl}/api/github-stats/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subnet_ids: 'invalid' })
    });
    if (batchResponse.status !== 400) {
      throw new Error(`Expected 400 for invalid batch request, got ${batchResponse.status}`);
    }

    console.log(`   🚫 Error handling working correctly`);
  }

  /**
   * Test 9: Data consistency and scoring
   */
  async testDataConsistency() {
    const subnetIds = [1, 5];
    const batchResult = await this.githubClient.getBatchSubnetActivity(subnetIds, 1);
    
    for (const [subnetId, result] of Object.entries(batchResult.results)) {
      // Verify required fields
      const requiredFields = ['subnet_id', 'github_url', 'commits_last_30_days', 'activity_score'];
      for (const field of requiredFields) {
        if (!(field in result)) {
          throw new Error(`Missing required field '${field}' in subnet ${subnetId} result`);
        }
      }

      // Verify data types and ranges
      if (typeof result.commits_last_30_days !== 'number' || result.commits_last_30_days < 0) {
        throw new Error(`Invalid commits_last_30_days for subnet ${subnetId}: ${result.commits_last_30_days}`);
      }

      if (typeof result.activity_score !== 'number' || result.activity_score < 0 || result.activity_score > 100) {
        throw new Error(`Invalid activity_score for subnet ${subnetId}: ${result.activity_score}`);
      }

      // Verify GitHub URL matches subnet metadata
      const expectedUrl = getSubnetGithubUrl(parseInt(subnetId));
      if (result.github_url !== expectedUrl) {
        throw new Error(`GitHub URL mismatch for subnet ${subnetId}: expected ${expectedUrl}, got ${result.github_url}`);
      }
    }

    console.log(`   ✓ Data consistency verified for ${subnetIds.length} subnets`);
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🚀 Starting GitHub Activity Monitoring Integration Tests\n');
    console.log(`🔧 Configuration:`);
    console.log(`   - GitHub Token: ${process.env.GITHUB_TOKEN ? 'CONFIGURED' : 'MISSING'}`);
    console.log(`   - Backend URL: ${this.backendUrl}`);
    console.log(`   - Rate Limit: ${this.githubClient.getRateLimitStatus().remaining} requests`);

    // Run all test cases
    await this.runTest('Subnet Metadata & GitHub URLs', () => this.testSubnetMetadata());
    await this.runTest('GitHub Client Basics', () => this.testGitHubClientBasics());
    
    if (process.env.GITHUB_TOKEN) {
      await this.runTest('Real Repository Analysis', () => this.testRealRepositoryAnalysis());
      await this.runTest('Batch Subnet Analysis', () => this.testBatchAnalysis());
      await this.runTest('Data Consistency & Scoring', () => this.testDataConsistency());
    } else {
      console.log('\n⚠️  Skipping GitHub API tests - token not configured');
    }

    await this.runTest('Backend Individual Endpoint', () => this.testBackendIndividualEndpoint());
    await this.runTest('Backend Batch Endpoint', () => this.testBackendBatchEndpoint());
    await this.runTest('Backend Paginated Endpoint', () => this.testBackendPaginatedEndpoint());
    await this.runTest('Error Handling', () => this.testErrorHandling());

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('🧪 GitHub Activity Monitoring Test Results');
    console.log('='.repeat(60));
    console.log(`✅ Tests Passed: ${this.testResults.passed}`);
    console.log(`❌ Tests Failed: ${this.testResults.failed}`);
    console.log(`📊 Total Tests: ${this.testResults.total}`);
    console.log(`🎯 Success Rate: ${Math.round((this.testResults.passed / this.testResults.total) * 100)}%`);

    if (this.testResults.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults.errors.forEach(error => {
        console.log(`   - ${error.test}: ${error.error}`);
      });
    }

    const finalRateLimit = this.githubClient.getRateLimitStatus();
    console.log(`\n🔍 Final Rate Limit: ${finalRateLimit.remaining} requests remaining`);

    if (this.testResults.failed === 0) {
      console.log('\n🎉 All tests passed! GitHub Activity Monitoring is ready for production.');
    } else {
      console.log(`\n⚠️  ${this.testResults.failed} test(s) failed. Please review and fix before deployment.`);
      process.exit(1);
    }
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new GitHubIntegrationTester();
  await tester.runAllTests();
} 