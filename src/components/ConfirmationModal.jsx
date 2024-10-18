// ConfirmationModal.jsx
import React from 'react';
import { deleteUnratedQuotes } from '../utils/deleteUnratedQuotes';  // Import the function to delete unrated quotes

function ConfirmationModal({ setModalOpen }) {
    const handleConfirm = async () => {
        try {
            await deleteUnratedQuotes();
            alert('Unrated quotes deleted successfully.');
        } catch (error) {
            console.error('Error deleting unrated quotes:', error);
        }
        setModalOpen(false);  // Close the modal after confirmation
    };

    const handleCancel = () => {
        setModalOpen(false);  // Close the modal on cancel
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Are you sure?</h2>
                <p>This action will permanently delete all quotes that have not been rated by any user. This action is irreversible.</p>
                <div className="modal-buttons">
                    <button onClick={handleConfirm} className="confirm-button">Confirm</button>
                    <button onClick={handleCancel} className="cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
