
import { useState, useEffect, useCallback } from 'react';

const useAllocations = () => {
  const [entries, setEntries] = useState([]);

  const createNewEntry = () => ({
    id: Date.now() + Math.random(),
    project: '',
    type: 'Billable',
    hours: 0,
  });

  const addEntry = useCallback(() => {
    setEntries(prev => [...prev, createNewEntry()]);
  }, []);

  const removeEntry = useCallback((id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const updateEntry = useCallback((id, field, value) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  }, []);

  const clearEntries = useCallback(() => {
    setEntries([createNewEntry()]);
  }, []);

  useEffect(() => {
    if (entries.length === 0) {
      addEntry();
    }
  }, [addEntry, entries.length]);

  return {
    entries,
    addEntry,
    removeEntry,
    updateEntry,
    clearEntries,
  };
};

export default useAllocations;
