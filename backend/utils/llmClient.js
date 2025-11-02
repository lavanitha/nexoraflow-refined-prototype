const crypto = require('crypto');
const axios = require('axios');

/**
 * LLM Client utilities for OpenAI, Gemini, and OpenRouter
 */
class LLMClient {
  constructor() {
    this.provider = process.env.LLM_API_PROVIDER || 'gemini';
    // Use LLM_API_KEY or GEMINI_API_KEY (for Gemini provider)
    this.apiKey = process.env.LLM_API_KEY || (this.provider === 'gemini' ? process.env.GEMINI_API_KEY : null);
    this.rapidApiKey = process.env.RAPIDAPI_KEY;
    this.rapidApiHost = process.env.RAPIDAPI_HOST || 'baskarm28-adzuna-v1.p.rapidapi.com';
    this.timeout = 25000; // 25s
  }

  /**
   * Generate cache key from input parameters
   */
  generateCacheKey(career1, career2, location, timelineYears, userSkills) {
    const skillsHash = crypto
      .createHash('md5')
      .update(JSON.stringify(userSkills))
      .digest('hex')
      .substring(0, 8);
    const key = `${career1}|${career2}|${location}|${timelineYears}|${skillsHash}`;
    return crypto.createHash('md5').update(key).digest('hex');
  }

  /**
   * Fetch salary/demand data from Adzuna (RapidAPI)
   */
  async fetchRapidApiData(career, location = 'India') {
    if (!this.rapidApiKey || !this.rapidApiHost) {
      return null;
    }

    try {
      const params = {
        what: career,
        location0: location,
        page: '1',
        results_per_page: '10',
      };
      const response = await axios.get(`https://${this.rapidApiHost}/search`, {
        params,
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': this.rapidApiHost,
        },
        timeout: 10000, // 10s timeout for RapidAPI
      });

      const data = response.data;
      const avgSalary =
        data.results?.reduce((sum, r) => sum + (r.salary_min + r.salary_max) / 2, 0) /
        (data.results?.length || 1);
      const openingsCount = data.count || 0;
      const demandScore = Math.min(openingsCount / 1000, 1.0);

      return {
        avgSalary: Math.round(avgSalary || 0),
        demandScore,
        openingsCount,
      };
    } catch (error) {
      console.error(`[RapidAPI Error] ${career}:`, error.message);
      return null;
    }
  }

  /**
   * Call LLM with retry and fallback logic
   */
  async callLLM(prompt, systemMessage = 'You are a career analyst assistant. Return ONLY valid JSON. No explanations, no markdown, no code blocks. Just the JSON object.') {
    if (!this.apiKey) {
      return { model: 'none', data: null, error: 'LLM_API_KEY not set' };
    }

    const startTime = Date.now();
    let model = 'unknown';

    try {
      let responseText;

      if (this.provider === 'openai') {
        model = 'gpt-4o-mini';
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model,
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt },
          ],
          max_tokens: 800,
          temperature: 0.7,
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          timeout: this.timeout,
        });
        const data = response.data;
        responseText = data.choices?.[0]?.message?.content;
      } else if (this.provider === 'gemini') {
        model = 'gemini-1.5-flash';
        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`, {
          contents: [{ parts: [{ text: `${systemMessage}\n\n${prompt}` }] }],
          generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
        }, {
          headers: { 'Content-Type': 'application/json' },
          timeout: this.timeout,
        });
        const data = response.data;
        responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      } else if (this.provider === 'openrouter') {
        model = 'openai/gpt-4o-mini';
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
          model,
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt },
          ],
          max_tokens: 800,
          temperature: 0.7,
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
            'HTTP-Referer': process.env.APP_ORIGIN || 'http://localhost:5173',
            'X-Title': 'NexoraFlow Career Twin',
          },
          timeout: this.timeout,
        });
        const data = response.data;
        responseText = data.choices?.[0]?.message?.content;
      } else {
        return { model: 'none', data: null, error: 'Invalid LLM_API_PROVIDER' };
      }

      if (!responseText) {
        throw new Error('Empty response from LLM');
      }

      // Parse JSON with retry logic
      let parsed = null;
      try {
        parsed = JSON.parse(responseText);
      } catch (e) {
        // Try extracting first JSON object
        const match = responseText.match(/\{[\s\S]*\}/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      }

      const latencyMs = Date.now() - startTime;
      return { model, data: parsed, latencyMs, tokensUsed: parsed.estimatedTokens || 0 };
    } catch (error) {
      // Retry once for JSON parse errors
      if (error.message.includes('JSON') || error.message.includes('parse') || error.message.includes('No JSON')) {
        try {
          const retryPrompt = `${prompt}\n\nYour previous response was invalid JSON. Return only the JSON object with the same fields.`;
          let retryText;
          
          if (this.provider === 'openai') {
            const retry = await axios.post('https://api.openai.com/v1/chat/completions', {
              model,
              messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: retryPrompt },
              ],
              max_tokens: 800,
            }, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
              },
              timeout: this.timeout,
            });
            retryText = retry.data.choices?.[0]?.message?.content;
          } else if (this.provider === 'gemini') {
            const retry = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`, {
              contents: [{ parts: [{ text: `${systemMessage}\n\n${retryPrompt}` }] }],
              generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
            }, {
              headers: { 'Content-Type': 'application/json' },
              timeout: this.timeout,
            });
            retryText = retry.data.candidates?.[0]?.content?.parts?.[0]?.text;
          } else if (this.provider === 'openrouter') {
            const retry = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
              model,
              messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: retryPrompt },
              ],
              max_tokens: 800,
            }, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
                'HTTP-Referer': process.env.APP_ORIGIN || 'http://localhost:5173',
                'X-Title': 'NexoraFlow Career Twin',
              },
              timeout: this.timeout,
            });
            retryText = retry.data.choices?.[0]?.message?.content;
          }
          
          if (retryText) {
            const match = retryText.match(/\{[\s\S]*\}/);
            if (match) {
              const parsed = JSON.parse(match[0]);
              return { model, data: parsed, latencyMs: Date.now() - startTime, retried: true, tokensUsed: parsed.estimatedTokens || 0 };
            }
          }
        } catch (retryError) {
          console.error('[LLM Retry Failed]:', retryError.message);
        }
      }

      console.error('[LLM Error]:', error.message);
      return { model: 'fallback', data: null, error: error.message };
    }
  }

  /**
   * Generate deterministic fallback data
   */
  generateFallback(career1, career2, timelineYears, resolutionMonths, userSkills) {
    // Calculate start score from top 4 matching skills
    const sortedSkills = [...userSkills].sort((a, b) => b.score - a.score);
    const top4 = sortedSkills.slice(0, 4);
    const startScore = top4.length > 0 ? Math.round(top4.reduce((sum, s) => sum + s.score, 0) / top4.length) : 20;

    const endScore1 = Math.min(startScore + 10 * timelineYears, 95);
    const endScore2 = Math.min(startScore + 12 * timelineYears, 95);

    const timeline1 = [];
    const timeline2 = [];
    for (let month = 0; month <= resolutionMonths; month += Math.max(1, Math.floor(resolutionMonths / 6))) {
      const progress = month / resolutionMonths;
      timeline1.push({ month, score: Math.round(startScore + (endScore1 - startScore) * progress) });
      timeline2.push({ month, score: Math.round(startScore + (endScore2 - startScore) * progress) });
    }

    return {
      skill_overlap: userSkills.slice(0, 2).map((s) => s.name),
      skill_gap_career1: ['Industry Knowledge', 'Certifications'],
      skill_gap_career2: ['Industry Knowledge', 'Certifications'],
      demand_score: { career1: 0.5, career2: 0.5 },
      salary: { career1: 0, career2: 0, currency: 'INR' },
      projected_skill_timeline: { career1: timeline1, career2: timeline2 },
      transition_roadmap: [
        { month: 1, action: 'Complete foundational courses', estimateHours: 40 },
        { month: 6, action: 'Build project portfolio', estimateHours: 120 },
        { month: 12, action: 'Apply for positions and network', estimateHours: 80 },
      ],
      confidence: 0.3,
      sources: ['fallback-deterministic'],
    };
  }

  /**
   * Build LLM prompt with optional data
   */
  buildPrompt(career1, career2, timelineYears, resolutionMonths, userSkills, optionalData) {
    const optionalDataJson = optionalData ? JSON.stringify(optionalData) : '{}';
    return `Compare careers: "${career1}" vs "${career2}".

Inputs:
- timelineYears: ${timelineYears}
- resolutionMonths: ${resolutionMonths}
- userSkills: ${JSON.stringify(userSkills)}
- optional_data: ${optionalDataJson}

Requirements:
- Use optional_data for salary/demand if present; do not change those numbers.
- Return JSON with exact keys: skill_overlap, skill_gap_career1, skill_gap_career2, demand_score, salary, projected_skill_timeline, transition_roadmap, confidence, sources.
- projected_skill_timeline: include month=0 and month=${resolutionMonths} entries for each career.
- transition_roadmap: 3-6 actionable steps including month and estimateHours.
- confidence: 0.0–1.0 numeric.

Return JSON only.`;
  }
}

module.exports = new LLMClient();

