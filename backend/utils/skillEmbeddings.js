const axios = require('axios');
const crypto = require('crypto');

/**
 * Skill Embeddings utility
 * Generates OpenAI embeddings for skills and handles Pinecone (optional)
 */
class SkillEmbeddings {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.pineconeApiKey = process.env.PINECONE_API_KEY;
    this.pineconeEnv = process.env.PINECONE_ENV;
    this.pineconeIndex = process.env.PINECONE_INDEX || 'skill-dna';
    this.usePinecone = !!(this.pineconeApiKey && this.pineconeEnv);
    
    // In-memory cache for embeddings
    this.embeddingCache = new Map();
  }

  /**
   * Generate embedding for a skill using OpenAI
   */
  async generateEmbedding(text) {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Check cache
    const cacheKey = crypto.createHash('md5').update(text.toLowerCase()).digest('hex');
    if (this.embeddingCache.has(cacheKey)) {
      return this.embeddingCache.get(cacheKey);
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
          model: 'text-embedding-3-small',
          input: text,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          timeout: 15000,
        }
      );

      const embedding = response.data.data[0].embedding;
      
      // Cache embedding
      this.embeddingCache.set(cacheKey, embedding);
      
      return embedding;
    } catch (error) {
      console.error('[Embeddings Error]:', error.message);
      throw new Error('Failed to generate embedding');
    }
  }

  /**
   * Generate embeddings for multiple skills
   */
  async generateEmbeddings(skills) {
    const embeddings = {};
    
    for (const skill of skills) {
      try {
        const text = `${skill.name} ${skill.category || ''}`;
        embeddings[skill.id] = await this.generateEmbedding(text);
      } catch (error) {
        console.error(`[Embedding Error for ${skill.name}]:`, error.message);
        // Use fallback: simple hash-based pseudo-embedding
        embeddings[skill.id] = this.generateFallbackEmbedding(skill);
      }
    }
    
    return embeddings;
  }

  /**
   * Fallback embedding generator (deterministic based on skill name)
   */
  generateFallbackEmbedding(skill) {
    const hash = crypto.createHash('md5').update(`${skill.name}-${skill.category}`).digest('hex');
    const embedding = new Array(1536).fill(0);
    
    // Generate deterministic pseudo-embedding from hash
    for (let i = 0; i < hash.length && i < embedding.length; i += 2) {
      const val = parseInt(hash.substr(i, 2), 16);
      embedding[i] = (val / 255) * 2 - 1; // Normalize to -1 to 1
    }
    
    return embedding;
  }

  /**
   * Get related skills using cosine similarity (if Pinecone not available, use in-memory)
   */
  async findRelatedSkills(skillId, allSkills, embeddings, topN = 3) {
    if (!embeddings[skillId]) {
      return [];
    }

    const targetEmbedding = embeddings[skillId];
    const similarities = [];

    for (const otherSkill of allSkills) {
      if (otherSkill.id === skillId || !embeddings[otherSkill.id]) {
        continue;
      }

      const otherEmbedding = embeddings[otherSkill.id];
      const similarity = this.cosineSimilarity(targetEmbedding, otherEmbedding);
      
      similarities.push({
        id: otherSkill.id,
        name: otherSkill.name,
        similarity,
      });
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topN)
      .map(s => s.name);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Generate micro-learn suggestions for a skill
   */
  async generateMicroLearns(skillName, skillCategory) {
    if (!this.apiKey) {
      // Return deterministic suggestions
      return [
        `Complete ${skillName} fundamentals tutorial`,
        `Build a project using ${skillName}`,
        `Join ${skillName} community and practice`,
      ];
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a learning advisor. Suggest 3 concise, actionable micro-learning activities. Return only a JSON array of 3 strings.',
            },
            {
              role: 'user',
              content: `Suggest 3 micro-learning activities to improve ${skillName} (${skillCategory}) skills. Each should be actionable and take 1-2 hours.`,
            },
          ],
          max_tokens: 200,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          timeout: 15000,
        }
      );

      const text = response.data.choices[0].message.content;
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length === 3) {
          return parsed;
        }
      } catch (e) {
        // Extract array from response
        const match = text.match(/\[[\s\S]*?\]/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (Array.isArray(parsed)) {
            return parsed.slice(0, 3);
          }
        }
      }

      // Fallback
      return [
        `Complete ${skillName} fundamentals tutorial`,
        `Build a project using ${skillName}`,
        `Join ${skillName} community and practice`,
      ];
    } catch (error) {
      console.error('[MicroLearns Error]:', error.message);
      return [
        `Complete ${skillName} fundamentals tutorial`,
        `Build a project using ${skillName}`,
        `Join ${skillName} community and practice`,
      ];
    }
  }
}

module.exports = new SkillEmbeddings();

