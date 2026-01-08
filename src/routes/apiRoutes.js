const express = require('express');
const router = express.Router();

const rateLimiter =
  require('../middlewares/rateLimiter');

router.use(rateLimiter);

router.get("/data", (req, res) => {
  res.json({ data: "Lua Sliding Window protected data" });
});

router.get("/burst-data", (req, res) => {
  res.json({ data: "Token Bucket protected data" });
});

router.get("/health", (req, res) => {
  res.json({ message: "Server healthy" });
});

module.exports = router;