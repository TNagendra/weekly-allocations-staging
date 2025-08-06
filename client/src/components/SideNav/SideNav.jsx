import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaClock, FaFilter, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './SideNav.css';

const SideNav = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
    const allowedEmails = [
        'arati.misal@kloctechnologies.com',
        'shilpa.yadav@kloctechnologies.com',
        'pooja.h@kloctechnologies.com',
        'sandra.shivadas@kloctechnologies.com',
        'chetna.vyas@kloctechnologies.com',
        'abhisarika.das@kloctechnologies.com',
        'nagendra.t@kloctechnologies.com',
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsOpen((open) => !open);

    return (
        <>
            <button
                className="hamburger-btn"
                onClick={toggleSidebar}
                aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                aria-expanded={isOpen}
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            <nav className={`side-nav ${isOpen ? 'expanded' : 'collapsed'}`} aria-label="Primary navigation">
                <div className="side-nav-header">
                    <h2 className="side-nav-title" style={{ display: isOpen ? 'block' : 'none' }}>Weekly Allocations</h2>
                    <button
                        className="close-btn"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                        style={{ display: isOpen && window.innerWidth < 768 ? 'block' : 'none' }}
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                <section className="user-info" style={{ display: isOpen ? 'block' : 'none' }}>
                    <p>Welcome,</p>
                    <p className="user-name">{user?.name}</p>
                    <p className="user-email">{user?.email}</p>
                </section>

                <ul className="nav-links">
                    <li>
                        <NavLink
                            to="/time-allocation"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                            onClick={() => {
                                if (window.innerWidth < 768) setIsOpen(false);
                            }}
                            title="Time Allocation"
                        >
                            <FaClock className="nav-icon" />
                            {isOpen && <span className="nav-text">Time Allocation</span>}
                        </NavLink>
                    </li>
                    {allowedEmails.includes(user?.email) && (
                        <li>
                            <NavLink
                                to="/filter-table"
                                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                                onClick={() => {
                                    if (window.innerWidth < 768) setIsOpen(false);
                                }}
                                title="Filter Table"
                            >
                                <FaFilter className="nav-icon" />
                                {isOpen && <span className="nav-text">Filter Table</span>}
                            </NavLink>
                        </li>
                    )}
                </ul>
                <button
                    className="logout-btn"
                    onClick={onLogout}
                    title="Logout"
                    style={{ justifyContent: isOpen ? 'flex-start' : 'center' }}
                >
                    <FaSignOutAlt className="nav-icon" />
                    {isOpen && <span className="nav-text">Logout</span>}
                </button>
            </nav>
        </>
    );
};

export default SideNav;
