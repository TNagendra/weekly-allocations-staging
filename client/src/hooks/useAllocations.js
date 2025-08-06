// import { useState, useEffect } from 'react';

// const useAllocations = () => {
//   const [entries, setEntries] = useState([]);

//   const createNewEntry = () => ({
//     id: Date.now() + Math.random(),
//     project: '',
//     type: 'Billable',
//     hours: 0
//   });

//   const addEntry = () => {
//     setEntries(prev => [...prev, createNewEntry()]);
//   };

//   const removeEntry = (id) => {
//     setEntries(prev => prev.filter(entry => entry.id !== id));
//   };

//   const updateEntry = (id, field, value) => {
//     setEntries(prev => prev.map(entry => 
//       entry.id === id ? { ...entry, [field]: value } : entry
//     ));
//   };

//   const clearEntries = () => {
//     setEntries([createNewEntry()]);
//   };

//   // Initialize with one empty entry
//   useEffect(() => {
//     if (entries.length === 0) {
//       addEntry();
//     }
//   }, [addEntry, entries.length]);

//   return {
//     entries,
//     addEntry,
//     removeEntry,
//     updateEntry,
//     clearEntries
//   };
// };

// export default useAllocations;
import { useState, useEffect, useCallback } from 'react';

const useAllocations = () => {
  const [entries, setEntries] = useState([]);

  const createNewEntry = () => ({
    id: Date.now() + Math.random(),
    project: '',
    type: 'Billable',
    hours: 0,
  });

  // Wrap in useCallback so `addEntry` has stable reference
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

  // Initialize with one empty entry only if entries is empty
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
