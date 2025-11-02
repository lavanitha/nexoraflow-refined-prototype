/**
 * MongoDB connection utility
 * Lightweight connection handler for career-twin data persistence
 */

let client = null;
let db = null;
let isConnected = false;

async function connect() {
  if (isConnected && db) {
    return db;
  }

  try {
    // Dynamic import to avoid requiring mongodb if MONGO_URI is not set
    const { MongoClient } = require('mongodb');
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      return null;
    }

    client = new MongoClient(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    db = client.db();
    isConnected = true;

    console.log('[MongoDB] Connected successfully');
    return db;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error.message);
    isConnected = false;
    return null;
  }
}

async function getCollection(collectionName) {
  const database = await connect();
  if (!database) return null;
  return database.collection(collectionName);
}

async function close() {
  if (client) {
    await client.close();
    isConnected = false;
    db = null;
    client = null;
    console.log('[MongoDB] Connection closed');
  }
}

module.exports = {
  connect,
  getCollection,
  close,
  get isConnected() {
    return isConnected;
  },
};

