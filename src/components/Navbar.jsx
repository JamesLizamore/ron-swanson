// Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';

function Navbar({ setLoggedIn }) {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleLogout = () => {
        setLoggedIn(false);
    };

    const openModal = () => {
        setModalOpen(true);
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
                {/* New Delete Unrated Quotes button */}
                <li className="navbar-item">
                    <button className="navbar-delete-button" onClick={openModal}>
                        ⚠️ Delete Unrated Quotes
                    </button>
                </li>
            </ul>
            {/* Modal for confirmation */}
            {isModalOpen && <ConfirmationModal setModalOpen={setModalOpen} />}
        </nav>
    );
}

export default Navbar;
