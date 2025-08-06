
import React from 'react';
import AllocationRow from './AllocationRow';
import '../styles/AllocationStyles.css';

const AllocationTable = ({ entries, onAddEntry, onRemoveEntry, onUpdateEntry, disabled, projectOptions }) => {
  const calculateTotalHours = () => {
    return entries.reduce((total, entry) => total + (entry.hours || 0), 0);
  };

  return (
    <div className="allocation-container">
      <div className="table-wrapper">
        <table className="allocation-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Hours</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <AllocationRow
                key={entry.id}
                entry={entry}
                onUpdate={onUpdateEntry}
                onRemove={onRemoveEntry}
                disabled={disabled}
                projectOptions={projectOptions}
              />
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td className="total-label">Total Hours:</td>
              <td className="total-hours">{calculateTotalHours().toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="button-container">
        <button 
          onClick={onAddEntry}
          disabled={disabled}
          className="add-row-button primary-button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add Row
        </button>
      </div>
    </div>
  );
};

export default AllocationTable;
