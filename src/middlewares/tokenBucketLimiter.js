const tokenBucketLua = require('../services/rateLimiter/tokenBucketLua');
const rateLimitConfig = require('../../config/rateLimitConfig');

function getUserIdentifier(req) {
  return req.user?.id || req.ip;
}

module.exports = function tokenBucketLimiter() {
  return async (req, res, next) => {
    try {
      const routeKey = req.route?.path;
      const method = req.method;

      const config = rateLimitConfig[routeKey];

      if (!config) return next();

      const userId = getUserIdentifier(req);

      const redisKey = `rate_limit:${userId}:${routeKey}:${method}`;

      const result = await tokenBucketLua({
        key: redisKey,
        capacity: config.capacity,
        refillRate: config.refillRate
      });

      if (!result.allowed) {
        return res.status(429).json({
          message: "Too Many Requests"
        });
      }

      res.setHeader(
        "X-RateLimit-Remaining",
        Math.max(0, Math.floor(result.tokensRemaining))
      );

      next();
    } catch (err) {
      console.error("Token Bucket Error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};