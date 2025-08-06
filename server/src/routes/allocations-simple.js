const express = require('express');
const router = express.Router();
const googleSheetsService = require('../services/googleSheetsService');

router.post('/', async (req, res) => {
  const result = await googleSheetsService.submitAllocations(req.body);
  res.json(result);
});
// Simple inline handlers for testing
router.get('/', (req, res) => {
  res.json({ message: 'Allocations API working' });
});

router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
});

router.post('/submit', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Submit endpoint working (mock)',
    received: req.body
  });
});

router.get('/allocations', async (req, res) => {
  const result = await googleSheetsService.getAllocationsData();
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

router.get('/read', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
  
    try {
      const result = await googleSheetsService.getAllocationsData(); // Use correct function here
      if (result.success) {
        res.status(200).json(result.data);
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Error in /read:', error.message);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });
  

module.exports = router;
