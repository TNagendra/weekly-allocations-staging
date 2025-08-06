
const googleSheetsService = require('../services/googleSheetsService');
const logger = require('../utils/logger');

const submitAllocation = async (req, res) => {
  try {
    const { person, weekStart, entries } = req.body;
    
    console.log('Controller received data:', { person, weekStart, entries });
    logger.info(`Processing allocation for ${person}, week starting ${weekStart}`);
    
    const result = await googleSheetsService.submitAllocations({
      person,
      weekStart,
      entries
    });
    
    console.log('Google Sheets service result:', result);
    
    if (result.success) {
      console.log('Allocation submitted successfully');
      res.json({ 
        success: true, 
        message: 'Allocation submitted successfully',
        data: result.data 
      });
    } else {
      console.log('Google Sheets submission failed:', result.error);
      res.status(200).json({
        success: false,
        error: result.error,
        message: 'Failed to submit to Google Sheets'
      });
    }
  } catch (error) {
    console.error('Unexpected error in controller:', error);
    logger.error('Error submitting allocation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to submit allocation',
      details: error.message 
    });
  }
};
const readData = async (req, res) => {
  try {
    const result = await googleSheetsService.getAllocationsData();
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error in readData:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch allocation data',
      error: error.message 
    });
  }
};

const testConnection = async (req, res) => {
  try {
    console.log('Testing connection from controller...');
    const result = await googleSheetsService.testConnection();
    
    console.log('Test connection result:', result);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Google Sheets connection successful',
        data: result.data,
        timestamp: new Date().toISOString() 
      });
    } else {
      res.status(200).json({
        success: false,
        error: result.error,
        message: 'Connection test failed'
      });
    }
  } catch (error) {
    console.error('Unexpected error in test connection:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Connection test failed',
      details: error.message 
    });
  }
};

module.exports = {
  readData,
  submitAllocation,
  testConnection
};
