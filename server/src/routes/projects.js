const express = require('express');
const router = express.Router();
const googleSheetsService = require('../services/googleSheetsService');

router.get('/', async (req, res) => {
  const result = await googleSheetsService.getProjectsWithManagers();
  res.json(result);
});

module.exports = router;
