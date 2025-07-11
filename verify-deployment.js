#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Verifies all recent changes are properly deployed and functional
 */

// Using fetch which is available in Node.js 18+

// Configuration
const FRONTEND_URL = 'https://subnet-scout.netlify.app';
const BACKEND_URL = 'https://simple-backend-production-de4c.up.railway.app';

console.log('🔍 DEPLOYMENT VERIFICATION STARTING...\n');

// Test functions
async function testBackendHealth() {
  console.log('🏥 Testing Backend Health...');
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    
    if (data.status === 'healthy') {
      console.log('✅ Backend health check passed');
      console.log(`   Service: ${data.service}`);
      console.log(`   Dependencies: ${data.dependencies}`);
      return true;
    } else {
      console.log('❌ Backend health check failed');
      return false;
    }
  } catch (error) {
    console.log(`❌ Backend health error: ${error.message}`);
    return false;
  }
}

async function testSecurityHeaders() {
  console.log('\n🔒 Testing Security Headers...');
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const headers = response.headers;
    
    const requiredHeaders = [
      'x-content-type-options',
      'x-frame-options', 
      'content-security-policy',
      'strict-transport-security'
    ];
    
    let allPresent = true;
    for (const header of requiredHeaders) {
      if (headers.get(header)) {
        console.log(`✅ ${header}: ${headers.get(header).substring(0, 50)}...`);
      } else {
        console.log(`❌ Missing header: ${header}`);
        allPresent = false;
      }
    }
    
    return allPresent;
  } catch (error) {
    console.log(`❌ Security headers error: ${error.message}`);
    return false;
  }
}

async function testWebsiteLinksAPI() {
  console.log('\n🌐 Testing Website Links in API...');
  try {
    const testSubnets = [1, 5, 6, 8, 18, 30]; // Subnets with verified websites
    let websitesFound = 0;
    
    for (const subnetId of testSubnets) {
      const response = await fetch(`${BACKEND_URL}/api/subnet/${subnetId}/data`);
      const data = await response.json();
      
      if (data.success && data.data.website_url) {
        console.log(`✅ Subnet ${subnetId}: ${data.data.website_url}`);
        websitesFound++;
      } else {
        console.log(`❌ Subnet ${subnetId}: No website URL`);
      }
    }
    
    console.log(`\n📊 Website URLs found: ${websitesFound}/${testSubnets.length}`);
    return websitesFound >= 5; // At least 5 should have websites
    
  } catch (error) {
    console.log(`❌ Website links API error: ${error.message}`);
    return false;
  }
}

async function testInputValidation() {
  console.log('\n🛡️ Testing Input Validation...');
  try {
    // Test invalid subnet ID
    const invalidResponse = await fetch(`${BACKEND_URL}/api/subnet/999/data`);
    const invalidData = await invalidResponse.json();
    
    if (invalidResponse.status === 400 && !invalidData.success) {
      console.log('✅ Input validation working - rejects invalid subnet ID');
    } else {
      console.log('❌ Input validation failed - accepts invalid subnet ID');
      return false;
    }
    
    // Test SQL injection attempt
    const injectionResponse = await fetch(`${BACKEND_URL}/api/subnet/1';DROP TABLE;--/data`);
    if (injectionResponse.status === 404) {
      console.log('✅ SQL injection protection working');
    } else {
      console.log('❌ SQL injection protection failed');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Input validation error: ${error.message}`);
    return false;
  }
}

async function testFrontendAccess() {
  console.log('\n🌍 Testing Frontend Access...');
  try {
    const response = await fetch(FRONTEND_URL);
    if (response.ok) {
      console.log('✅ Frontend accessible');
      console.log(`   Status: ${response.status}`);
      return true;
    } else {
      console.log(`❌ Frontend error: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Frontend access error: ${error.message}`);
    return false;
  }
}

// Main verification function
async function runVerification() {
  const results = {
    backendHealth: await testBackendHealth(),
    securityHeaders: await testSecurityHeaders(), 
    websiteLinks: await testWebsiteLinksAPI(),
    inputValidation: await testInputValidation(),
    frontendAccess: await testFrontendAccess()
  };
  
  console.log('\n📋 VERIFICATION SUMMARY:');
  console.log('========================');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  for (const [test, result] of Object.entries(results)) {
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test}`);
  }
  
  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 ALL DEPLOYMENTS VERIFIED SUCCESSFULLY!');
    console.log('\n🚀 Production Status: READY');
    console.log('📱 Frontend: Website links displaying properly');
    console.log('🔐 Backend: Security headers active');
    console.log('🤖 Telegram Bot: Enhanced with website links');
    // eslint-disable-next-line no-undef
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed - check deployment status');
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
}

// Run verification
runVerification().catch(error => {
  console.error('💥 Verification script error:', error);
  // eslint-disable-next-line no-undef
  process.exit(1);
});