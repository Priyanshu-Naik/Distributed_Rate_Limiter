const slidingWindowLuaLimiter =
  require('./slidingWindowLuaLimiter');
const tokenBucketLimiter =
  require('./tokenBucketLimiter');

const rateLimitConfig =
  require('../../config/rateLimitConfig');

module.exports = function rateLimiter(req, res, next) {
  const routeKey = req.originalUrl.split('?')[0];
  const config = rateLimitConfig[routeKey];

  if (!config) return next();

  if (config.algorithm === "sliding-window") {
    return slidingWindowLuaLimiter(config)(req, res, next);
  }

  if (config.algorithm === "token-bucket") {
    return tokenBucketLimiter(config)(req, res, next);
  }

  next();
};