// // import React, { useState } from 'react';
// // import './SideNav.css';
// // import { FaClock, FaFilter, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
// // import { NavLink } from 'react-router-dom';

// // const SideNav = ({ user, onLogout }) => {
// //   const [isOpen, setIsOpen] = useState(false);

// //   const toggleSidebar = () => {
// //     setIsOpen(!isOpen);
// //   };

// //   return (
// //     <>
// //       <button
// //         className="hamburger-btn"
// //         onClick={toggleSidebar}
// //         aria-label={isOpen ? 'Close menu' : 'Open menu'}
// //         aria-expanded={isOpen}
// //       >
// //         <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
// //         <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
// //         <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
// //       </button>

// //       <nav className={`side-nav ${isOpen ? 'open' : ''}`} aria-label="Main navigation">
// //         <div className="side-nav-header">
// //           <h2 className="side-nav-title">AllocationsApp</h2>
// //           <button className="close-btn" onClick={toggleSidebar} aria-label="Close menu">
// //             &times;
// //           </button>
// //         </div>

// //         <div className="user-info">
// //           <p>Welcome,</p>
// //           <p className="user-name">{user?.name}</p>
// //           <p className="user-email">{user?.email}</p>
// //         </div>

// //         <ul className="nav-links">
// //           <li><a href="#time-allocation">Time Allocation</a></li>
// //           <li><a href="#filter-table">Filter Table</a></li>
// //         </ul>

// //         <button className="logout-btn" onClick={onLogout}>
// //           Logout
// //         </button>
// //       </nav>

// //       {isOpen && <div className="overlay" onClick={toggleSidebar} aria-hidden="true"></div>}
// //     </>
// //   );
// // };

// // export default SideNav;
// import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import { FaClock, FaFilter, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
// import './SideNav.css';

// const SideNav = ({ user, onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   return (
//     <>
//       {/* Hamburger menu button for mobile */}
//       <button
//         className="hamburger-btn"
//         onClick={toggleSidebar}
//         aria-label={isOpen ? 'Close menu' : 'Open menu'}
//         aria-expanded={isOpen}
//       >
//         {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//       </button>

//       <nav className={`side-nav ${isOpen ? 'open' : ''}`} aria-label="Primary navigation">
//         <div className="side-nav-header">
//           <h2 className="side-nav-title">MyApp</h2>
//           <button
//             className="close-btn"
//             onClick={toggleSidebar}
//             aria-label="Close menu"
//           >
//             <FaTimes size={24} />
//           </button>
//         </div>

//         <section className="user-info">
//           <p>Welcome,</p>
//           <p className="user-name">{user?.name}</p>
//           <p className="user-email">{user?.email}</p>
//         </section>

//         <ul className="nav-links">
//           <li>
//             <NavLink
//               to="/time-allocation"
//               className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
//               onClick={() => setIsOpen(false)}
//             >
//               <FaClock className="nav-icon" />
//               Time Allocation
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/filter-table"
//               className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
//               onClick={() => setIsOpen(false)}
//             >
//               <FaFilter className="nav-icon" />
//               Filter Table
//             </NavLink>
//           </li>
//         </ul>

//         <button className="logout-btn" onClick={onLogout}>
//           <FaSignOutAlt className="nav-icon" />
//           Logout
//         </button>
//       </nav>

//       {/* Overlay for mobile menu open */}
//       {isOpen && <div className="overlay" onClick={toggleSidebar} aria-hidden="true"></div>}
//     </>
//   );
// };

// export default SideNav;
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

    // Update isOpen on window resize to sync with screen size
    useEffect(() => {
        const handleResize = () => {
            // Auto expand sidebar on desktop (>=768px), collapse on mobile (<768px)
            if (window.innerWidth >= 768) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        // Call once on mount
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsOpen((open) => !open);

    return (
        <>
            {/* Hamburger toggle visible only on mobile */}
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
                    {/* <li>
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
          </li> */}
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
