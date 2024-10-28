// Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';
import { auth } from '../config/firebase';

function Navbar() {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            // onAuthStateChanged in App.jsx will handle state updates
        } catch (error) {
            console.error('Error signing out:', error);
        }
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
                    <Link to="/profile" className="navbar-link">Profile</Link>
                </li>
                <li className="navbar-item">
                    <button onClick={handleLogout} className="navbar-button">Log Out</button>
                </li>
                {/* Delete Unrated Quotes button */}
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
