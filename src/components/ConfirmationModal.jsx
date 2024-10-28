// ConfirmationModal.jsx
import React from 'react';
import { deleteUnratedQuotes } from '../utils/deleteUnratedQuotes';
import { auth } from '../config/firebase'; // Import Firebase auth

function ConfirmationModal({ setModalOpen }) {
    const handleConfirm = async () => {
        const authorizedEmail = 'jameswlizamore@gmail.com'; // Replace with your authorized email
        const userEmail = auth.currentUser.email;

        if (userEmail !== authorizedEmail) {
            alert('Permission denied');
            setModalOpen(false);
            return;
        }

        try {
            await deleteUnratedQuotes();
            alert('Unrated quotes deleted successfully.');
        } catch (error) {
            console.error('Error deleting unrated quotes:', error);
            alert('An error occurred while deleting unrated quotes.');
        } finally {
            setModalOpen(false);
        }
    };

    const handleCancel = () => {
        setModalOpen(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Are you sure?</h2>
                <p>
                    This action will permanently delete all quotes that have not been rated
                    by any user. This action is irreversible.
                </p>
                <div className="modal-buttons">
                    <button onClick={handleConfirm} className="confirm-button">
                        Confirm
                    </button>
                    <button onClick={handleCancel} className="cancel-button">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
