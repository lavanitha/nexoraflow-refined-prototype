const axios = require('axios');

/**
 * RapidAPI Client utility
 * Handles API calls to RapidAPI services (Adzuna, Google Trends, etc.)
 */
class RapidAPIClient {
  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY;
    this.host = process.env.RAPIDAPI_HOST || 'baskarm28-adzuna-v1.p.rapidapi.com';
    this.baseUrl = `https://${this.host}`;
    this.timeout = 15000; // 15s timeout
  }

  /**
   * Check if RapidAPI is configured
   */
  isConfigured() {
    return !!this.apiKey;
  }

  /**
   * Get job trends from Adzuna
   */
  async getJobTrends(career, location = 'India', count = 10) {
    if (!this.apiKey) {
      throw new Error('RAPIDAPI_KEY not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/jobs/search`, {
        params: {
          results_per_page: count,
          what: career,
          where: location,
        },
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': this.host,
        },
        timeout: this.timeout,
      });

      return {
        results: response.data.results || [],
        count: response.data.count || 0,
      };
    } catch (error) {
      console.error('[RapidAPI Job Trends Error]:', error.message);
      throw new Error('Failed to fetch job trends');
    }
  }

  /**
   * Get salary data for a career
   */
  async getSalaryData(career, location = 'India') {
    if (!this.apiKey) {
      throw new Error('RAPIDAPI_KEY not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/jobs/search`, {
        params: {
          results_per_page: 1,
          what: career,
          where: location,
          salary_min: 1,
        },
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': this.host,
        },
        timeout: this.timeout,
      });

      const results = response.data.results || [];
      if (results.length === 0) {
        return { min: 0, max: 0, avg: 0, currency: 'INR' };
      }

      // Calculate salary range from results
      const salaries = results
        .map(r => r.salary_min || r.salary_max || 0)
        .filter(s => s > 0);

      if (salaries.length === 0) {
        return { min: 0, max: 0, avg: 0, currency: 'INR' };
      }

      const min = Math.min(...salaries);
      const max = Math.max(...salaries);
      const avg = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);

      return { min, max, avg, currency: 'INR' };
    } catch (error) {
      console.error('[RapidAPI Salary Error]:', error.message);
      return { min: 0, max: 0, avg: 0, currency: 'INR' };
    }
  }

  /**
   * Search for opportunities (jobs/events)
   */
  async searchOpportunities(query, filters = {}) {
    if (!this.apiKey) {
      throw new Error('RAPIDAPI_KEY not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/jobs/search`, {
        params: {
          results_per_page: filters.limit || 20,
          what: query,
          where: filters.location || 'India',
          ...(filters.category && { category: filters.category }),
        },
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': this.host,
        },
        timeout: this.timeout,
      });

      return response.data.results || [];
    } catch (error) {
      console.error('[RapidAPI Search Error]:', error.message);
      return [];
    }
  }
}

module.exports = new RapidAPIClient();

