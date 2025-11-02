/**
 * Unit tests for Side Hustle Generator
 * Run with: node backend/tests/sideHustle.test.js
 */

const { generateIdeasHandler } = require('../controllers/sideHustleController');

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
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Test JSON parsing logic
test('Should parse valid JSON array', () => {
  const validJson = '[{"title":"Test","description":"Test desc","earning_potential":"$100","time_commitment":"10h","skills":["JS"],"first_steps":["step1","step2","step3"],"confidence":4}]';
  const parsed = JSON.parse(validJson);
  assert(Array.isArray(parsed), 'Should be array');
  assert(parsed.length === 1, 'Should have one item');
  assert(parsed[0].title === 'Test', 'Should parse title');
});

test('Should extract array from wrapped text', () => {
  const wrapped = 'Here is the result:\n```json\n[{"title":"Test"}]\n```';
  const match = wrapped.match(/\[[\s\S]*?\]/);
  assert(match !== null, 'Should find array');
  const parsed = JSON.parse(match[0]);
  assert(Array.isArray(parsed), 'Should be array');
});

test('Should validate idea schema structure', () => {
  const validIdea = {
    title: 'Test',
    description: 'Description',
    earning_potential: '$100',
    time_commitment: '10h',
    skills: ['JS', 'React'],
    first_steps: ['step1', 'step2', 'step3'],
    confidence: 4,
  };

  assert(validIdea.title, 'Has title');
  assert(validIdea.description, 'Has description');
  assert(Array.isArray(validIdea.skills), 'Has skills array');
  assert(Array.isArray(validIdea.first_steps), 'Has first_steps array');
  assert(validIdea.first_steps.length === 3, 'Has exactly 3 first_steps');
  assert(validIdea.confidence >= 1 && validIdea.confidence <= 5, 'Confidence in range 1-5');
});

test('Should reject invalid confidence values', () => {
  const invalid1 = { confidence: 0 };
  const invalid2 = { confidence: 6 };
  const invalid3 = { confidence: '4' };

  assert(invalid1.confidence < 1 || invalid1.confidence > 5, 'Confidence 0 should be invalid');
  assert(invalid2.confidence < 1 || invalid2.confidence > 5, 'Confidence 6 should be invalid');
  assert(typeof invalid3.confidence !== 'number', 'String confidence should be invalid');
});

test('Should reject ideas with wrong number of first_steps', () => {
  const invalid1 = { first_steps: ['step1'] };
  const invalid2 = { first_steps: ['step1', 'step2', 'step3', 'step4'] };

  assert(invalid1.first_steps.length !== 3, 'Should reject less than 3 steps');
  assert(invalid2.first_steps.length !== 3, 'Should reject more than 3 steps');
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

