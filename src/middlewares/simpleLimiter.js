const redis = require("../../config/redisClient");

module.exports = async function simpleLimiter(req, res, next) {
  const user = req.ip; 
  const key = `rate_limit:${user}`;

  const requests = await redis.incr(key);

  if (requests === 1) {
    await redis.expire(key, 10); 
  }

  if (requests > 5) {
    return res.status(429).json({ message: "Too Many Requests" });
  }

  next();
};