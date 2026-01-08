const redis = require('../../../config/redisClient');
const fs = require('fs');
const path = require('path');

const script = fs.readFileSync(
  path.join(__dirname, 'scripts/slidingWindow.lua'),
  'utf8'
);

let sha;

async function loadScript() {
  if (!sha) {
    sha = await redis.script('LOAD', script);
  }
}

module.exports = async function slidingWindowLua({
  key,
  windowSizeInSeconds,
  maxRequests
}) {
  await loadScript();

  const now = Date.now();

  const result = await redis.evalsha(
    sha,
    1,
    key,
    now,
    windowSizeInSeconds * 1000,
    maxRequests
  );

  return {
    allowed: result[0] === 1,
    currentCount: result[1]
  };
};