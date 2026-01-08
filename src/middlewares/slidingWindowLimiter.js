const redis = require('../../config/redisClient');

module.exports = function slidingWindowLimiter({
  windowSizeInSeconds,
  maxRequests
}) {
  return async (req, res, next) => {
    try {
      const userKey = `rate_limit:${req.ip}`;   
      const now = Date.now();

      // Removing old timestamps
      await redis.zremrangebyscore(userKey, 0, now - windowSizeInSeconds * 1000);

      // Counting requests in current window
      const requestCount = await redis.zcard(userKey);

      if (requestCount >= maxRequests) {
        return res.status(429).json({
          message: "Too many requests. Try again later."
        });
      }

      // Adding new timestamp
      await redis.zadd(userKey, now, now);

      // Setting TTL so Redis clears unused keys
      await redis.expire(userKey, windowSizeInSeconds);

      next();
    } catch (err) {
      console.error("Sliding Window Limiter Error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};