// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ setLoggedIn }) {
    const handleLogout = () => {
        setLoggedIn(false); // Log the user out
    };

    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item">
                    <Link to="/rate" className="navbar-link">Rate a Quote</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/rated" className="navbar-link">Rated Quotes</Link>
                </li>
                <li className="navbar-item">
                    <button onClick={handleLogout} className="navbar-button">Log Out</button>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
