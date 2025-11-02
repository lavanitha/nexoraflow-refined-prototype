const express = require('express');
const router = express.Router();

// Import route modules
const dashboardRoutes = require('./dashboard');
const adviseRoutes = require('./advise');
const communityRoutes = require('./community');
const learningRoutes = require('./learning');
const achievementRoutes = require('./achievement');
const coachingRoutes = require('./coaching');
const compareRoutes = require('./compare');
const careerTwinRoutes = require('./careerTwin');
const sideHustleRoutes = require('./sideHustle');
const skillDNARoutes = require('./skillDNA');
const trendFeedRoutes = require('./trendFeed');
const predictiveEvolutionRoutes = require('./predictiveEvolution');
const resilienceCoachRoutes = require('./resilienceCoach');
const learningPathwaysRoutes = require('./learningPathways');
const communityNexusRoutes = require('./communityNexus');
const blockchainPassportRoutes = require('./blockchainPassport');

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'NexoraFlow API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount route modules
router.use('/dashboard', dashboardRoutes);
router.use('/advise', adviseRoutes);
router.use('/community', communityRoutes);
router.use('/learning', learningRoutes);
router.use('/achievement', achievementRoutes);
router.use('/coaching', coachingRoutes);
router.use('/career-twin', careerTwinRoutes); // Career Twin routes
router.use('/sidehustle', sideHustleRoutes); // Side Hustle routes
router.use('/skill-dna', skillDNARoutes); // Skill DNA routes
router.use('/trend-feed', trendFeedRoutes); // Industry Trend Feed routes
router.use('/predictive-evolution', predictiveEvolutionRoutes); // Predictive Career Evolution routes
router.use('/resilience-coach', resilienceCoachRoutes); // AI Resilience Coach routes
router.use('/learning-pathways', learningPathwaysRoutes); // Learning Pathways routes
router.use('/community-nexus', communityNexusRoutes); // Community Nexus routes
router.use('/blockchain-passport', blockchainPassportRoutes); // Skill Blockchain Passport routes
// Achievement routes already mounted at /achievement above
router.use('/', compareRoutes); // Compare routes mounted at root level

module.exports = router;