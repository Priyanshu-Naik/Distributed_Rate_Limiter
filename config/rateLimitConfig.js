module.exports = {
  "/api/burst-data": {
    algorithm: "token-bucket",
    capacity: 10,
    refillRate: 1   // tokens per second
  },

  "/api/login": {
    algorithm: "token-bucket",
    capacity: 3,
    refillRate: 0.1 // 1 request every 10 seconds
  },

  "/api/health": {
    algorithm: "none"
  }
};