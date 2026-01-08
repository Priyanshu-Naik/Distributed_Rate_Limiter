const slidingWindowLua = require(
  '../services/rateLimiter/slidingWindowLua'
);

module.exports = function slidingWindowLuaLimiter(config) {
  return async (req, res, next) => {
    try {
      const key = `rate_limit:${req.ip}`;

      const result = await slidingWindowLua({
        key,
        windowSizeInSeconds: config.windowSizeInSeconds,
        maxRequests: config.maxRequests
      });

      if (!result.allowed) {
        return res.status(429).json({
          message: "Too Many Requests",
          retryAfter: config.windowSizeInSeconds
        });
      }

      res.setHeader(
        "X-RateLimit-Remaining",
        Math.max(0, config.maxRequests - result.currentCount)
      );

      next();
    } catch (err) {
      console.error("Sliding Window Lua Error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};