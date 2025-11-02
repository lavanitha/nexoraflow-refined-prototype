const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom logger middleware
const logger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  const requestLog = {
    requestId: req.id,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    timestamp: new Date().toISOString()
  };

  console.log(`[${req.id}] ${req.method} ${req.url} - Started`);

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    
    const responseLog = {
      ...requestLog,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      success: data.success !== false,
      responseSize: JSON.stringify(data).length
    };

    console.log(`[${req.id}] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);

    // Write to log file in production
    if (process.env.NODE_ENV === 'production') {
      const logEntry = JSON.stringify(responseLog) + '\n';
      const logFile = path.join(logsDir, `access-${new Date().toISOString().split('T')[0]}.log`);
      fs.appendFileSync(logFile, logEntry);
    }

    return originalJson.call(this, data);
  };

  next();
};

// Error logger
const errorLogger = (err, req, res, next) => {
  const errorLog = {
    requestId: req.id,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack
    },
    request: {
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    },
    timestamp: new Date().toISOString()
  };

  console.error(`[${req.id}] Error:`, err.message);

  // Write error to log file
  if (process.env.NODE_ENV === 'production') {
    const logEntry = JSON.stringify(errorLog) + '\n';
    const logFile = path.join(logsDir, `error-${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, logEntry);
  }

  next(err);
};

module.exports = {
  logger,
  errorLogger
};