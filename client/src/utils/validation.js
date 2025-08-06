export const validateForm = ({ person, weekStart, entries }) => {
    if (!person || person.trim().length === 0) {
      return { isValid: false, error: 'Please enter your name.' };
    }
  
    if (!weekStart) {
      return { isValid: false, error: 'Please select a week starting date.' };
    }
  
    if (!entries || entries.length === 0) {
      return { isValid: false, error: 'Please add at least one allocation entry.' };
    }
  
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (!entry.project || entry.project.trim().length === 0) {
        return { isValid: false, error: `Please enter a project name for row ${i + 1}.` };
      }
      
      if (!entry.hours || entry.hours <= 0) {
        return { isValid: false, error: `Please enter valid hours for row ${i + 1}.` };
      }
    }
  
    return { isValid: true };
  };
  