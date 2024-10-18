import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';  // Import Firestore

const SetUsername = ({ setLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSetUsername = async () => {
        try {
            const userId = auth.currentUser.uid;

            // Save the username to Firestore under the 'users' collection
            await setDoc(doc(db, 'users', userId), { username });

            // After setting the username, log the user into the app
            setLoggedIn(true);
        } catch (err) {
            setError('Failed to set username. Please try again.');
        }
    };

    return (
        <div className="set-username-page">
            <h2>Set Your Username</h2>
            <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleSetUsername}>Set Username</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default SetUsername;
