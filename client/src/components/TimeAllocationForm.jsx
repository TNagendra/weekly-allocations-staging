
import React, { useState, useEffect } from 'react';
import AllocationTable from './AllocationTable';
import { submitAllocation } from '../services/api';
import { validateForm } from '../utils/validation';
import { fetchProjects } from '../services/api';
import useAllocations from '../hooks/useAllocations';
import '../styles/AllocationStyles.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TimeAllocationForm = ({ user }) => {
    // const [person, setPerson] = useState('');
    const [person, setPerson] = useState('');

    useEffect(() => {
        if (user?.name) {
            setPerson(user.name);
        }
    }, [user]);

    //   const [weekStart, setWeekStart] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { entries, addEntry, removeEntry, updateEntry, clearEntries } = useAllocations();
    const [projects, setProjects] = useState([]);
    function getMondayOfCurrentWeek() {
        const now = new Date();
        const day = now.getDay();
        const diff = (day === 0 ? -6 : 1) - day;
        const monday = new Date(now.setDate(now.getDate() + diff));
        return monday.toISOString().slice(0, 10);
    }
    // const [weekStart, setWeekStart] = useState(getMondayOfCurrentWeek());
    const [weekStart] = useState(getMondayOfCurrentWeek());
    useEffect(() => {
        const loadProjects = async () => {
            const result = await fetchProjects();
            if (result.success) {
                setProjects(result.data);
            } else {
                alert("Failed to load projects: " + result.error);
            }
        };
        loadProjects();
    }, []);
    const showResetConfirm = () => {
        toast.info(
            <div>
                Are you sure you want to reset all data?
                <div style={{ marginTop: '8px' }}>
                    <button
                        onClick={() => {
                            clearEntries();
                            // setPerson('');
                            toast.dismiss(); // close toast
                            toast.success('Form reset!');
                        }}
                        className="toast-confirm-btn"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="toast-cancel-btn"
                        style={{ marginLeft: '10px' }}
                    >
                        No
                    </button>
                </div>
            </div>,
            { autoClose: false }
        );
    };

    const handleSubmit = async () => {
        const validation = validateForm({ person, weekStart, entries });
        if (!validation.isValid) {
            toast.error(validation.error);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await submitAllocation({
                person: person.trim(),
                weekStart,
                entries: entries.map(({ id, ...entry }) => entry)
            });

            if (response.success) {
                toast.success('Submitted successfully!');
                // setPerson('');
                // setWeekStart('');
                clearEntries();
            } else {
                throw new Error(response.error || 'Submission failed');
            }
        } catch (error) {
            toast.error('Error submitting data: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        showResetConfirm();
    };

    return (
        <div className="time-allocation-form">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="form-header">
                <h2>Weekly Time Allocation</h2>
                <p className="form-subtitle">Track your weekly project hours</p>
            </div>

            <div className="form-content">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="person">Your Name:</label>
                        {/* <input
                            type="text"
                            id="person"
                            value={person}
                            onChange={(e) => setPerson(e.target.value)}
                            placeholder="Enter your name"
                            disabled={isSubmitting}
                            className="form-input"
                        /> */}
                        <input
                            type="text"
                            id="person"
                            value={person}
                            disabled
                            className="form-input"
                            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                        />

                    </div>

                    <div className="form-group">
                        <label htmlFor="weekStart">Week Starting:</label>

                        <input
                            type="date"
                            id="weekStart"
                            value={weekStart}
                            disabled
                            className="form-input"
                            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                        />

                    </div>
                </div>

                <AllocationTable
                    entries={entries}
                    onAddEntry={addEntry}
                    onRemoveEntry={removeEntry}
                    onUpdateEntry={updateEntry}
                    disabled={isSubmitting}
                    projectOptions={projects}
                />

                <div className="form-actions">
                    <button
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className="reset-button secondary-button"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C9.61395 21 7.44737 20.0604 5.85383 18.5568" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 18V12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Reset
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="submit-button primary-button"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="spinner"></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4905 2.02168 11.3363C2.16356 9.18209 2.99721 7.13314 4.39828 5.49C5.79935 3.84686 7.69279 2.69617 9.79619 2.20158C11.8996 1.70699 14.1003 1.89544 16.07 2.74" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Submit
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimeAllocationForm;
