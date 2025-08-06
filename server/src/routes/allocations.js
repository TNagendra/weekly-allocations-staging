const express = require('express');
const router = express.Router();

// Import controller and middleware
const allocationController = require('../controllers/allocationController');
const validationMiddleware = require('../middleware/validation');

// Debug: Check if controller functions exist
console.log('Controller functions:', Object.keys(allocationController));

// Basic route for testing
router.get('/', (req, res) => {
  res.json({ 
    message: 'Allocations API is working',
    routes: [
      'GET /api/allocations/ - API info',
      'GET /api/allocations/test - Test connection',
      'POST /api/allocations/submit - Submit allocation',
      'GET /api/allocations/read - Read data'
    ]
  });
});

// Define routes with proper error checking
router.get('/test', allocationController.testConnection);
// router.get('/read', allocationController.readData);
router.post('/submit', validationMiddleware.validateAllocation, allocationController.submitAllocation);

module.exports = router;
