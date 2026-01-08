const express = require('express');
const apiRoutes = require('./apiRoutes');

const router = express.Router();

router.get('/example', (req, res) => {
  res.send('This is an example route.');
});

router.use('/', apiRoutes);

module.exports = router;