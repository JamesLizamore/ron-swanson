// SetUsername.jsx
import React, { useState } from 'react';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const SetUsername = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSetUsername = async () => {
        try {
            const trimmedUsername = username.trim();

            // Input validation
            if (trimmedUsername.length < 3) {
                setError('Username must be at least 3 characters long.');
                return;
            }

            // Check for duplicate usernames
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('username', '==', trimmedUsername));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setError('Username is already taken. Please choose another one.');
                return;
            }

            // Save the username to Firestore
            const userId = auth.currentUser.uid;
            await setDoc(doc(db, 'users', userId), { username: trimmedUsername });

            // onAuthStateChanged in App.jsx will handle state updates
        } catch (err) {
            setError('Failed to set username. Please try again.');
            console.error('Error setting username:', err);
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
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default SetUsername;
