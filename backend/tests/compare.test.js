/**
 * Unit tests for Career Compare API
 * Run with: node backend/tests/compare.test.js
 */

const llmClient = require('../utils/llmClient');
const Cache = require('../utils/cache');

// Simple test runner
let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    testsPassed++;
    console.log(`✓ ${name}`);
  } catch (error) {
    testsFailed++;
    console.error(`✗ ${name}: ${error.message}`);
    console.error('  ', error.stack);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

async function testAsync(name, fn) {
  try {
    await fn();
    testsPassed++;
    console.log(`✓ ${name}`);
  } catch (error) {
    testsFailed++;
    console.error(`✗ ${name}: ${error.message}`);
    console.error('  ', error.stack);
  }
}

console.log('Running Career Compare API tests...\n');

// Cache tests
test('Cache should store and retrieve values', () => {
  const cache = new Cache(1);
  cache.set('test-key', { data: 'test' });
  const value = cache.get('test-key');
  assert(value.data === 'test', 'Cache retrieval failed');
  cache.clear();
});

test('Cache should return correct size', () => {
  const cache = new Cache(1);
  cache.set('key1', { data: 1 });
  cache.set('key2', { data: 2 });
  assert(cache.size() === 2, 'Cache size incorrect');
  cache.clear();
});

test('Cache should clear all entries', () => {
  const cache = new Cache(1);
  cache.set('key1', { data: 1 });
  cache.set('key2', { data: 2 });
  cache.clear();
  assert(cache.size() === 0, 'Cache clear failed');
});

// LLM Client tests
test('Should generate cache key correctly', () => {
  const key1 = llmClient.generateCacheKey('Career1', 'Career2', 'India', 2, [{ name: 'JS', score: 80 }]);
  const key2 = llmClient.generateCacheKey('Career1', 'Career2', 'India', 2, [{ name: 'JS', score: 80 }]);
  const key3 = llmClient.generateCacheKey('Career1', 'Career2', 'USA', 2, [{ name: 'JS', score: 80 }]);
  
  assert(key1 === key2, 'Same inputs should produce same key');
  assert(key1 !== key3, 'Different inputs should produce different keys');
});

test('Should generate deterministic fallback', () => {
  const userSkills = [
    { name: 'JavaScript', score: 80 },
    { name: 'React', score: 70 },
    { name: 'SQL', score: 60 },
  ];

  const fallback = llmClient.generateFallback('Frontend Engineer', 'Data Scientist', 2, 24, userSkills);

  assert(fallback.sources.includes('fallback-deterministic'), 'Should include fallback source');
  assert(Array.isArray(fallback.projected_skill_timeline.career1), 'Should have timeline for career1');
  assert(Array.isArray(fallback.projected_skill_timeline.career2), 'Should have timeline for career2');
  assert(fallback.transition_roadmap.length === 3, 'Should have 3 roadmap steps');
  assert(fallback.confidence === 0.3, 'Should have confidence 0.3');
  assert(typeof fallback.demand_score.career1 === 'number', 'Should have demand score');
  assert(typeof fallback.salary.career1 === 'number', 'Should have salary');
});

test('Should build prompt with optional data', () => {
  const prompt = llmClient.buildPrompt(
    'Engineer',
    'Scientist',
    2,
    24,
    [{ name: 'JS', score: 80 }],
    { Engineer: { salary: 100000, demand: 0.8 } }
  );

  assert(prompt.includes('Engineer'), 'Prompt should contain career1');
  assert(prompt.includes('Scientist'), 'Prompt should contain career2');
  assert(prompt.includes('optional_data'), 'Prompt should contain optional data');
  assert(prompt.includes('"month":24'), 'Prompt should contain resolution');
});

// Rate limiter tests
testAsync('Rate limiter should be available', async () => {
  const { defaultLimiter } = require('../utils/rateLimiter');
  assert(defaultLimiter !== undefined, 'Rate limiter should be defined');
  assert(typeof defaultLimiter.middleware === 'function', 'Should have middleware function');
  assert(typeof defaultLimiter.getStats === 'function', 'Should have getStats function');
});

// LLM response parsing tests
test('Should parse valid JSON response', () => {
  const validJson = JSON.stringify({
    skill_overlap: ['JS'],
    skill_gap_career1: ['Python'],
    skill_gap_career2: ['SQL'],
    demand_score: { career1: 0.8, career2: 0.7 },
    salary: { career1: 100000, career2: 120000, currency: 'USD' },
    projected_skill_timeline: {
      career1: [{ month: 0, score: 60 }, { month: 24, score: 80 }],
      career2: [{ month: 0, score: 65 }, { month: 24, score: 85 }],
    },
    transition_roadmap: [{ month: 1, action: 'Learn Python', estimateHours: 40 }],
    confidence: 0.8,
    sources: ['llm-openai'],
  });
  
  try {
    const parsed = JSON.parse(validJson);
    assert(parsed.skill_overlap.length > 0, 'Should parse skill_overlap');
    assert(typeof parsed.confidence === 'number', 'Should parse confidence as number');
    assert(parsed.projected_skill_timeline.career1.length >= 2, 'Should have timeline data');
  } catch (e) {
    throw new Error('Valid JSON should parse successfully');
  }
});

test('Should extract JSON from malformed response', () => {
  const malformed = 'Here is the result:\n```json\n{"skill_overlap":["JS"],"confidence":0.8}\n```\nHope this helps!';
  const match = malformed.match(/\{[\s\S]*\}/);
  assert(match !== null, 'Should find JSON in malformed response');
  const parsed = JSON.parse(match[0]);
  assert(parsed.skill_overlap !== undefined, 'Should extract skill_overlap');
});

test('Should generate fallback when LLM key missing', () => {
  // Temporarily remove API key
  const originalKey = process.env.LLM_API_KEY;
  delete process.env.LLM_API_KEY;
  
  // Re-require to get fresh instance without key
  delete require.cache[require.resolve('../utils/llmClient')];
  const freshClient = require('../utils/llmClient');
  
  const fallback = freshClient.generateFallback('Engineer', 'Scientist', 2, 24, [
    { name: 'JS', score: 80 },
    { name: 'React', score: 70 },
  ]);
  
  assert(fallback.sources.includes('fallback-deterministic'), 'Fallback should have deterministic source');
  assert(fallback.confidence === 0.3, 'Fallback confidence should be 0.3');
  assert(fallback.transition_roadmap.length === 3, 'Fallback should have 3 roadmap steps');
  assert(fallback.demand_score.career1 === 0.5 && fallback.demand_score.career2 === 0.5, 'Fallback demand scores should be 0.5');
  
  // Restore API key
  if (originalKey) process.env.LLM_API_KEY = originalKey;
});

test('Fallback should include month=0 and month=resolutionMonths in timeline', () => {
  const fallback = llmClient.generateFallback('Engineer', 'Scientist', 2, 24, [
    { name: 'JS', score: 80 },
  ]);
  
  const timeline1 = fallback.projected_skill_timeline.career1;
  const timeline2 = fallback.projected_skill_timeline.career2;
  
  assert(timeline1.some(t => t.month === 0), 'Timeline should start at month 0');
  assert(timeline1.some(t => t.month === 24), 'Timeline should end at month 24');
  assert(timeline2.some(t => t.month === 0), 'Timeline2 should start at month 0');
  assert(timeline2.some(t => t.month === 24), 'Timeline2 should end at month 24');
});

console.log('\n' + '='.repeat(50));
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsFailed}`);
console.log('='.repeat(50));

if (testsFailed === 0) {
  console.log('\n✓ All tests passed!');
  process.exit(0);
} else {
  console.log('\n✗ Some tests failed');
  process.exit(1);
}
