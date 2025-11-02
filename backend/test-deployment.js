/**
 * Quick deployment test script
 * Run after deployment to verify endpoints work
 * Usage: node test-deployment.js
 */

const API_URL = process.env.API_URL || 'http://localhost:3002';

async function testEndpoint(name, url, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${url}`, options);
    const data = await response.json();
    
    console.log(`✅ ${name}:`, response.status, data.success !== undefined ? `Success: ${data.success}` : 'OK');
    return { success: true, status: response.status, data };
  } catch (error) {
    console.log(`❌ ${name}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log(`\n🧪 Testing NexoraFlow API: ${API_URL}\n`);

  // Health check
  await testEndpoint('Health Check', '/api/health');

  // Test endpoints
  await testEndpoint('Side Hustle', '/api/sidehustle', 'POST', {
    skills: ['JavaScript', 'React'],
    hoursPerWeek: 10
  });

  await testEndpoint('Skill DNA Profile', '/api/skill-dna/profile');
  
  await testEndpoint('Trend Feed', '/api/trend-feed/trends?industry=AI&location=India');
  
  await testEndpoint('Predictive Evolution', '/api/predictive-evolution/project', 'POST', {
    careerId: 'data-scientist',
    experienceLevel: 50,
    projectionWindow: 5
  });

  await testEndpoint('Resilience Coach Session', '/api/resilience-coach/session', 'POST', {
    input: 'Feeling stressed about work',
    type: 'stress'
  });

  await testEndpoint('Achievements', '/api/achievements');
  
  await testEndpoint('Learning Pathways', '/api/learning-pathways');
  
  await testEndpoint('Community Nexus', '/api/community-nexus/opportunities?query=JavaScript');
  
  await testEndpoint('Blockchain Passport', '/api/blockchain-passport/records');

  console.log('\n✅ Testing complete!\n');
}

// Run tests if using fetch in Node 18+
if (typeof fetch !== 'undefined') {
  runTests();
} else {
  console.log('⚠️  This script requires Node.js 18+ with fetch support');
  console.log('   Or install node-fetch: npm install node-fetch');
  console.log('\n   Manual test commands:');
  console.log(`   curl ${API_URL}/api/health`);
  console.log(`   curl -X POST ${API_URL}/api/sidehustle \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{"skills":["JavaScript"],"hoursPerWeek":10}'`);
}

