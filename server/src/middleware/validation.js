const validateAllocation = (req, res, next) => {
  const { person, weekStart, entries } = req.body;

  // Validate person
  if (!person || typeof person !== 'string' || person.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Person name is required and must be a non-empty string'
    });
  }

  // Validate weekStart
  if (!weekStart || !isValidDate(weekStart)) {
    return res.status(400).json({
      success: false,
      error: 'Valid week start date is required (YYYY-MM-DD format)'
    });
  }

  // Validate entries
  if (!entries || !Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'At least one allocation entry is required'
    });
  }

  // Validate each entry
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    
    if (!entry.project || typeof entry.project !== 'string' || entry.project.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: `Entry ${i + 1}: Project name is required`
      });
    }

    if (!entry.type || !['Billable', 'Internal'].includes(entry.type)) {
      return res.status(400).json({
        success: false,
        error: `Entry ${i + 1}: Type must be either 'Billable' or 'Internal'`
      });
    }

    if (typeof entry.hours !== 'number' || entry.hours <= 0) {
      return res.status(400).json({
        success: false,
        error: `Entry ${i + 1}: Hours must be a positive number`
      });
    }
  }

  next();
};

const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Make sure to export the function properly
module.exports = {
  validateAllocation
};
