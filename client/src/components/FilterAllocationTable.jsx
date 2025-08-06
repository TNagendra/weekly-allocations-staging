
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../styles/FilterAllocationTable.css';

// const FilterAllocationTable = () => {
//   const [allData, setAllData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [weekOptions, setWeekOptions] = useState([]);
//   const [managerOptions, setManagerOptions] = useState([]);
//   const [selectedWeek, setSelectedWeek] = useState('');
//   const [selectedManager, setSelectedManager] = useState('');
//   const [selectedRows, setSelectedRows] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await axios.get('/api/allocations/read');
//         const data = response.data || [];
//         setAllData(data);

//         // Unique weeks and managers
//         const weeks = [...new Set(data.map((d) => d.weekStart))].sort((a, b) => new Date(b) - new Date(a));
//         setWeekOptions(weeks);
//         const mgrs = [...new Set(data.map((d) => d.manager || "N/A"))].sort();
//         setManagerOptions(['', ...mgrs]); // add empty for "All"

//         const defaultWeek = weeks[0] || '';
//         setSelectedWeek(defaultWeek);
//         setSelectedManager('');
//         filterAndSet(data, defaultWeek, '');
//       } catch (error) {
//         console.error('Failed to fetch allocations:', error);
//       }
//     }
//     fetchData();
//   }, []);

//   // Helper to filter data
//   const filterAndSet = (data, week, manager) => {
//     let result = data.filter((d) => d.weekStart === week);
//     if (manager) result = result.filter((d) => d.manager === manager);
//     setFilteredData(result);
//     setSelectedRows([]); // reset selections when filtering
//   };

//   // Handlers
//   const handleWeekChange = (e) => {
//     const w = e.target.value;
//     setSelectedWeek(w);
//     filterAndSet(allData, w, selectedManager);
//   };
//   const handleManagerChange = (e) => {
//     const m = e.target.value;
//     setSelectedManager(m);
//     filterAndSet(allData, selectedWeek, m);
//   };

//   // Checkbox handlers
//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedRows(filteredData.map((_, idx) => idx));
//     } else {
//       setSelectedRows([]);
//     }
//   };
//   const handleSelectRow = (idx) => {
//     if (selectedRows.includes(idx)) {
//       setSelectedRows(selectedRows.filter((i) => i !== idx));
//     } else {
//       setSelectedRows([...selectedRows, idx]);
//     }
//   };

//   // Export to CSV
//   const exportCSV = () => {
//     if (selectedRows.length === 0) return;
//     const headers = ['Person', 'Project', 'Manager', 'Hours'];
//     const rows = selectedRows.map((idx) =>
//       [filteredData[idx].person, filteredData[idx].project, filteredData[idx].manager, filteredData[idx].hours]
//     );
//     let csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'allocations.csv';
//     a.click();
//     URL.revokeObjectURL(url);
//     setSelectedRows([]);
//   };

//   return (
//     <div className="container">
//       <h2 className="heading">Weekly Allocations</h2>
//       <div className="filters">
//         <div>
//           <label htmlFor="weekSelect">Week: </label>
//           <select id="weekSelect" value={selectedWeek} onChange={handleWeekChange}>
//             {weekOptions.map((week, i) =>
//               <option key={i} value={week}>{new Date(week).toLocaleDateString()}</option>
//             )}
//           </select>
//         </div>
//         <div>
//           <label htmlFor="managerSelect">Manager: </label>
//           <select id="managerSelect" value={selectedManager} onChange={handleManagerChange}>
//             <option value="">All</option>
//             {managerOptions.filter(m => m).map((m, i) =>
//               <option key={i} value={m}>{m}</option>
//             )}
//           </select>
//         </div>
//         <button className="export-btn" onClick={exportCSV} disabled={selectedRows.length === 0}>
//           Export CSV
//         </button>
//       </div>
//       <table className="allocation-table">
//         <thead>
//           <tr>
//             <th>
//               <input
//                 type="checkbox"
//                 checked={selectedRows.length === filteredData.length && filteredData.length !== 0}
//                 onChange={handleSelectAll}
//               />
//             </th>
//             <th>Person</th>
//             <th>Project</th>
//             <th>Manager</th>
//             <th>Hours</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.length > 0 ? (
//             filteredData.map((entry, idx) => (
//               <tr key={idx} className={selectedRows.includes(idx) ? "selected-row" : ""}>
//                 <td>
//                   <input
//                     type="checkbox"
//                     checked={selectedRows.includes(idx)}
//                     onChange={() => handleSelectRow(idx)}
//                   />
//                 </td>
//                 <td>{entry.person}</td>
//                 <td>{entry.project}</td>
//                 <td>{entry.manager || 'N/A'}</td>
//                 <td>{entry.hours}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="no-data">No data available for selected week or manager</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default FilterAllocationTable;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FilterAllocationTable.css';

const FilterAllocationTable = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [weekOptions, setWeekOptions] = useState([]);
  const [managerOptions, setManagerOptions] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/allocations/read');
        const rawData = response.data;
        console.log('API Response:', response);
        console.log('Raw Data:', rawData);
        // Ensure the data is an array
        const data = Array.isArray(rawData) ? rawData : [];

        setAllData(data);

        const weeks = [...new Set(data.map((d) => d.weekStart))].sort(
          (a, b) => new Date(b) - new Date(a)
        );
        setWeekOptions(weeks);

        const mgrs = [...new Set(data.map((d) => d.manager || 'N/A'))].sort();
        setManagerOptions(['', ...mgrs]);

        const defaultWeek = weeks[0] || '';
        setSelectedWeek(defaultWeek);
        setSelectedManager('');
        filterAndSet(data, defaultWeek, '');
      } catch (error) {
        console.error('Failed to fetch allocations:', error);
      }
    }
    fetchData();
  }, []);

  const filterAndSet = (data, week, manager) => {
    let result = data.filter((d) => d.weekStart === week);
    if (manager) result = result.filter((d) => d.manager === manager);
    setFilteredData(result);
    setSelectedRows([]);
  };

  const handleWeekChange = (e) => {
    const w = e.target.value;
    setSelectedWeek(w);
    filterAndSet(allData, w, selectedManager);
  };

  const handleManagerChange = (e) => {
    const m = e.target.value;
    setSelectedManager(m);
    filterAndSet(allData, selectedWeek, m);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredData.map((_, idx) => idx));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (idx) => {
    if (selectedRows.includes(idx)) {
      setSelectedRows(selectedRows.filter((i) => i !== idx));
    } else {
      setSelectedRows([...selectedRows, idx]);
    }
  };

  const exportCSV = () => {
    if (selectedRows.length === 0) return;

    const headers = ['Person', 'Project', 'Manager', 'Hours'];
    const rows = selectedRows.map((idx) => [
      filteredData[idx].person,
      filteredData[idx].project,
      filteredData[idx].manager,
      filteredData[idx].hours,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'allocations.csv';
    a.click();
    URL.revokeObjectURL(url);
    setSelectedRows([]);
  };

  return (
    <div className="container">
      <h2 className="heading">Weekly Allocations</h2>
      <div className="filters">
        <div>
          <label htmlFor="weekSelect">Week: </label>
          <select id="weekSelect" value={selectedWeek} onChange={handleWeekChange}>
            {weekOptions.map((week, i) => (
              <option key={i} value={week}>
                {new Date(week).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="managerSelect">Manager: </label>
          <select id="managerSelect" value={selectedManager} onChange={handleManagerChange}>
            <option value="">All</option>
            {managerOptions.filter((m) => m).map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <button className="export-btn" onClick={exportCSV} disabled={selectedRows.length === 0}>
          Export CSV
        </button>
      </div>
      <table className="allocation-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedRows.length === filteredData.length && filteredData.length !== 0}
                onChange={handleSelectAll}
              />
            </th>
            <th>Person</th>
            <th>Project</th>
            <th>Manager</th>
            <th>Hours</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((entry, idx) => (
              <tr key={idx} className={selectedRows.includes(idx) ? 'selected-row' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(idx)}
                    onChange={() => handleSelectRow(idx)}
                  />
                </td>
                <td>{entry.person}</td>
                <td>{entry.project}</td>
                <td>{entry.manager || 'N/A'}</td>
                <td>{entry.hours}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">
                No data available for selected week or manager
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FilterAllocationTable;
