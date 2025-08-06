const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000; 

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://weekly-allocations-prod.netlify.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const allocationRoutes = require('./routes/allocations-simple');
app.use('/api/allocations', allocationRoutes);
app.use('/allocations', allocationRoutes); 

const projectRoutes = require('./routes/projects');
app.use('/projects', projectRoutes);

const googleSheetsService = require('./services/googleSheetsService');
app.get('/test-sheets-connection', async (req, res) => {
  const result = await googleSheetsService.testConnection();
  res.json(result);
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
