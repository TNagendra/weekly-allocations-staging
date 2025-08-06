
import React from 'react';
import Select from 'react-select';  
import '../styles/AllocationStyles.css';

const AllocationRow = ({ entry, onUpdate, onRemove, disabled, projectOptions }) => {

  const options = projectOptions.map(p => ({ value: p.project, label: p.project }));

  const selectedOption = options.find(opt => opt.value === entry.project) || null;

  const handleChange = (selected) => {
    onUpdate(entry.id, 'project', selected ? selected.value : '');
  };

  return (
    <tr className="allocation-row">
      <td className="allocation-cell project-cell">
        <div className="select-wrapper">
          <Select
            value={selectedOption}
            onChange={handleChange}
            options={options}
            isDisabled={disabled}
            isClearable={false}
            className="allocation-select project-select"
            classNamePrefix="react-select"
            placeholder=""
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null} 
            menuPosition="fixed"
            menuPlacement="auto"
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
            }}
          />
        </div>
      </td>

      <td className="allocation-cell hours-cell">
        <input
          type="number"
          min="0"
          step="0.25"
          value={entry.hours}
          onChange={e => onUpdate(entry.id, 'hours', parseFloat(e.target.value) || 0)}
          disabled={disabled}
          placeholder="0"
          className="allocation-input hours-input"
        />
      </td>

      <td className="allocation-cell action-cell">
        <button
          onClick={() => onRemove(entry.id)}
          disabled={disabled}
          className="remove-button"
          aria-label="Remove allocation"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default AllocationRow;
