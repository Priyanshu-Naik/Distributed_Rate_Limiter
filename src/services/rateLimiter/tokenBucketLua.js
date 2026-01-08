const redis = require('../../../config/redisClient');

const luaScript = `
local key = KEYS[1]

local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local data = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens = tonumber(data[1])
local lastRefill = tonumber(data[2])

if tokens == nil then
  tokens = capacity
  lastRefill = now
end

-- Refill logic
local elapsed = (now - lastRefill) / 1000
local refill = elapsed * refillRate
tokens = math.min(capacity, tokens + refill)

if tokens < 1 then
  redis.call('HMSET', key, 'tokens', tokens, 'last_refill', lastRefill)
  return {0, math.floor(tokens)}
end

-- Consume token
tokens = tokens - 1
redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
redis.call('EXPIRE', key, math.ceil(capacity / refillRate))

return {1, math.floor(tokens)}
`;

module.exports = async function tokenBucketLua({
  key,
  capacity,
  refillRate
}) {
  const now = Date.now();

  const result = await redis.eval(
    luaScript,
    1,
    key,
    capacity,
    refillRate,
    now
  );

  return {
    allowed: result[0] === 1,
    remainingTokens: result[1]
  };
};