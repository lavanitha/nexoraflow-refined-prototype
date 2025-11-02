const axios = require('axios');
const Cache = require('../utils/cache');

// Initialize cache with 2 minute TTL
const cache = new Cache(2);

/**
 * Validate and parse OpenAI response
 */
function parseAIResponse(text) {
  try {
    // Try direct JSON parse first
    const parsed = JSON.parse(text);
    return parsed;
  } catch (e) {
    // Extract first array from response
    const arrayMatch = text.match(/\[[\s\S]*?\]/);
    if (arrayMatch) {
      try {
        return JSON.parse(arrayMatch[0]);
      } catch (e2) {
        throw new Error('Failed to parse JSON array from response');
      }
    }
    throw new Error('No valid JSON array found in response');
  }
}

/**
 * Validate idea schema
 */
function validateIdeas(ideas) {
  if (!Array.isArray(ideas) || ideas.length < 3 || ideas.length > 5) {
    return { valid: false, error: 'Expected array of 3-5 ideas' };
  }

  for (const idea of ideas) {
    if (!idea.title || typeof idea.title !== 'string') {
      return { valid: false, error: 'Missing or invalid title' };
    }
    if (!idea.description || typeof idea.description !== 'string') {
      return { valid: false, error: 'Missing or invalid description' };
    }
    if (!idea.earning_potential || typeof idea.earning_potential !== 'string') {
      return { valid: false, error: 'Missing or invalid earning_potential' };
    }
    if (!idea.time_commitment || typeof idea.time_commitment !== 'string') {
      return { valid: false, error: 'Missing or invalid time_commitment' };
    }
    if (!Array.isArray(idea.skills) || idea.skills.length === 0) {
      return { valid: false, error: 'Missing or invalid skills array' };
    }
    if (!Array.isArray(idea.first_steps) || idea.first_steps.length !== 3) {
      return { valid: false, error: 'Missing or invalid first_steps (must be array of 3 strings)' };
    }
    if (typeof idea.confidence !== 'number' || idea.confidence < 1 || idea.confidence > 5) {
      return { valid: false, error: 'Missing or invalid confidence (must be 1-5)' };
    }
  }

  return { valid: true };
}

/**
 * Build OpenAI prompt
 */
function buildPrompt(skills, interests, hoursPerWeek, tone = 'professional', filters = {}) {
  const skillsText = skills && skills.length > 0 ? skills.join(', ') : 'Not specified';
  const interestsText = interests || 'Not specified';
  const toneText = tone || 'professional';
  
  let prompt = `Generate 3-5 side-hustle ideas tailored to:
- Skills: ${skillsText}
- Interests: ${interestsText}
- Hours per week: ${hoursPerWeek}
- Tone: ${toneText}`;

  if (filters.category && filters.category.length > 0) {
    prompt += `\n- Preferred categories: ${filters.category.join(', ')}`;
  }
  if (filters.skillLevel) {
    prompt += `\n- Skill level: ${filters.skillLevel}`;
  }

  prompt += `\n\nRETURN ONLY valid JSON array of objects with EXACT keys:
- title (string)
- description (string, 2-3 sentences)
- earning_potential (string, e.g., "$500-$2000/month")
- time_commitment (string, e.g., "10-15 hours/week")
- skills (array of strings, 3-5 skills)
- first_steps (array of exactly 3 strings, actionable steps)
- confidence (number 1-5, where 5 is highest confidence)

Return only the JSON array, no markdown, no explanations.`;

  return prompt;
}

/**
 * POST /api/sidehustle - Generate side hustle ideas
 */
const generateIdeasHandler = async (req, res) => {
  const startTime = Date.now();

  try {
    // Validate payload
    const { skills, interests, hoursPerWeek, tone, filters } = req.body;

    if ((!skills || (Array.isArray(skills) && skills.length === 0)) && !interests) {
      return res.status(400).json({
        success: false,
        message: 'At least one of skills or interests is required',
      });
    }

    if (!hoursPerWeek || typeof hoursPerWeek !== 'number' || hoursPerWeek < 1 || hoursPerWeek > 168) {
      return res.status(400).json({
        success: false,
        message: 'hoursPerWeek must be a number between 1 and 168',
      });
    }

    // Normalize inputs
    const normalizedSkills = Array.isArray(skills) ? skills : (skills ? [skills] : []);
    const normalizedInterests = interests || '';
    const normalizedHours = Math.round(hoursPerWeek);
    const normalizedTone = tone || 'professional';
    const normalizedFilters = filters || {};

    // Generate cache key
    const cacheKey = require('crypto')
      .createHash('md5')
      .update(JSON.stringify({ skills: normalizedSkills, interests: normalizedInterests, hoursPerWeek: normalizedHours, tone: normalizedTone, filters: normalizedFilters }))
      .digest('hex');

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('[SideHustle] Cache hit');
      return res.json({
        success: true,
        ideas: cached,
        cached: true,
        latencyMs: Date.now() - startTime,
      });
    }

    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key not configured',
      });
    }

    // Build prompt
    const prompt = buildPrompt(normalizedSkills, normalizedInterests, normalizedHours, normalizedTone, normalizedFilters);

    // Call OpenAI
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a side-hustle idea generator. Return ONLY valid JSON arrays, no markdown, no explanations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.6,
        max_tokens: 700,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 30000, // 30s timeout
      }
    );

    const responseText = openaiResponse.data.choices?.[0]?.message?.content;
    if (!responseText) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse response
    let ideas;
    try {
      ideas = parseAIResponse(responseText);
    } catch (parseError) {
      console.error('[SideHustle] Parse error:', parseError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to parse AI response',
        rawResponse: responseText.substring(0, 500), // First 500 chars for debugging
        error: parseError.message,
      });
    }

    // Validate schema
    const validation = validateIdeas(ideas);
    if (!validation.valid) {
      console.error('[SideHustle] Validation error:', validation.error);
      return res.status(500).json({
        success: false,
        message: `Invalid response schema: ${validation.error}`,
        rawResponse: responseText.substring(0, 500),
      });
    }

    // Cache result
    cache.set(cacheKey, ideas);

    const latencyMs = Date.now() - startTime;
    console.log(`[SideHustle] Generated ${ideas.length} ideas in ${latencyMs}ms`);

    res.json({
      success: true,
      ideas,
      cached: false,
      latencyMs,
    });
  } catch (error) {
    console.error('[SideHustle Error]:', error.message);

    // Handle axios errors
    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: 'OpenAI API error',
        error: error.response.data?.error?.message || error.message,
      });
    }

    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        message: 'Request timeout - OpenAI API took too long to respond',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  generateIdeasHandler,
};

