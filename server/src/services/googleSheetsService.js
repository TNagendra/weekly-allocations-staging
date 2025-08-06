const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const path = require('path');

class GoogleSheetsService {
  constructor() {
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    console.log('GoogleSheetsService initialized');
  }

  async authenticate() {
    try {
      console.log('Authenticating using service account...');

      // const auth = new GoogleAuth({
      //   keyFile: path.join(__dirname, 'service-account.json'),
      //   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      // });
      // const auth = new GoogleAuth({
      //   credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      //   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      // });
      const rawCredentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

      // Replace escaped newlines in private_key with actual newlines
      rawCredentials.private_key = rawCredentials.private_key.replace(/\\n/g, '\n');

      const auth = new GoogleAuth({
        credentials: rawCredentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const authClient = await auth.getClient();

      this.sheets = google.sheets({ version: 'v4', auth: authClient });

      console.log('Google Sheets API initialized with service account');
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

async submitAllocations(data) {
    try {
      if (!this.sheets) await this.authenticate();
  
      const timestamp = new Date().toISOString();
  
      const projectsResult = await this.getProjectsWithManagers();
      if (!projectsResult.success) throw new Error(projectsResult.error);
      
      const projectManagerMap = {};
      projectsResult.data.forEach(p => {
        projectManagerMap[p.project] = p.manager;
      });
  
      const rows = data.entries.map(entry => {
        const manager = projectManagerMap[entry.project] || 'Unknown';
        return [
          timestamp,
          data.weekStart,
          data.person,
          entry.project,
          manager, 
          entry.hours
        ];
      });
  
      const request = {
        spreadsheetId: this.spreadsheetId,
        range: 'Allocations Staging!A:F', 
        valueInputOption: 'RAW',
        resource: { values: rows }
      };
  
      const response = await this.sheets.spreadsheets.values.append(request);
  
      const updatedRows = response.data?.updates?.updatedRows || 0;
      return {
        success: true,
        data: {
          updatedRows,
          updatedRange: response.data.updates?.updatedRange
        }
      };
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      return { success: false, error: error.message };
    }
  }
  
  async getProjectsWithManagers() {
    try {
      if (!this.sheets) {
        const authSuccess = await this.authenticate();
        if (!authSuccess) throw new Error('Authentication failed');
      }
  
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Projects Staging!A:Z'
      });
  
      const rows = response.data.values || [];
      if (rows.length === 0) {
        return { success: false, error: 'Projects sheet is empty' };
      }
  
      const header = rows[0];
      const projectIdx = header.findIndex(h => h.trim() === 'Project Name');
      const managerIdx = header.findIndex(h => h.trim() === 'Project Manager');
  
      if (projectIdx === -1 || managerIdx === -1) {
        return { success: false, error: 'Project Name or Manager column missing' };
      }
  
      const projects = rows.slice(1).map(row => ({
        project: row[projectIdx],
        manager: row[managerIdx]
      }));
  
      return {
        success: true,
        data: projects
      };
    } catch (error) {
      console.error('Error fetching projects with managers:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async getAllocationsData() {
    try {
      if (!this.sheets) {
        const authSuccess = await this.authenticate();
        if (!authSuccess) throw new Error('Authentication failed');
      }
  
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Allocation Staging!A:F', // Timestamp, weekStart, person, project, manager, hours
      });
  
      const rows = response.data.values;
      if (!rows || rows.length < 2) {
        return { success: false, error: 'No allocation data found' };
      }
  
      const [header, ...dataRows] = rows;
      const formatted = dataRows.map((row) => {
        return {
          timestamp: row[0],
          weekStart: row[1],
          person: row[2],
          project: row[3],
          manager: row[4],
          hours: row[5],
        };
      });
  
      return { success: true, data: formatted };
    } catch (error) {
      console.error('Error fetching allocation data:', error.message);
      return { success: false, error: error.message };
    }
  }
  
  async testConnection() {
    console.log('Testing Google Sheets connection...');
    try {
      if (!this.sheets) {
        const authSuccess = await this.authenticate();
        if (!authSuccess) throw new Error('Authentication failed');
      }

      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId
      });

      console.log('Connected. Title:', response.data.properties.title);
      return {
        success: true,
        data: {
          title: response.data.properties.title,
          sheets: response.data.sheets.map(sheet => sheet.properties.title)
        }
      };
    } catch (error) {
      console.error('Connection test failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new GoogleSheetsService();
