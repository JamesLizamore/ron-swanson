// UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import {
    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
} from 'firebase/firestore';
import {
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from 'firebase/auth';

const UserProfile = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [quotesRated, setQuotesRated] = useState(0);
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;

                if (user) {
                    const userId = user.uid;
                    const userEmail = user.email;
                    setEmail(userEmail);

                    // Fetch username
                    const userDoc = await getDoc(doc(db, 'users', userId));
                    if (userDoc.exists()) {
                        setUsername(userDoc.data().username);
                    }

                    // Fetch number of quotes rated
                    const ratingsQuery = query(
                        collection(db, 'ratings'),
                        where('userId', '==', userId)
                    );
                    const ratingsSnapshot = await getDocs(ratingsQuery);
                    setQuotesRated(ratingsSnapshot.size);
                } else {
                    setError('User is not authenticated.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data.');
            }
        };

        fetchUserData();
    }, []);

    const handleUsernameChange = async () => {
        try {
            const trimmedUsername = newUsername.trim();

            if (trimmedUsername === '' || trimmedUsername === username) {
                setError('Please enter a new username.');
                return;
            }

            // Check for duplicate usernames
            const usersQuery = query(
                collection(db, 'users'),
                where('username', '==', trimmedUsername)
            );
            const usersSnapshot = await getDocs(usersQuery);
            if (!usersSnapshot.empty) {
                setError('Username already taken.');
                return;
            }

            // Update username in Firestore
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                username: trimmedUsername,
            });
            setUsername(trimmedUsername);
            setNewUsername('');
            setError('');
            alert('Username updated successfully.');
        } catch (error) {
            console.error('Error updating username:', error);
            setError('Failed to update username.');
        }
    };

    const handleChangePassword = async () => {
        try {
            if (currentPassword.trim() === '' || password.trim() === '') {
                setError('Please enter your current and new password.');
                return;
            }

            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            // Reauthenticate user
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, password);
            setPassword('');
            setCurrentPassword('');
            setError('');
            alert('Password updated successfully.');
        } catch (error) {
            console.error('Error updating password:', error);
            setError('Failed to update password. Please check your current password.');
        }
    };

    return (
        <div className="user-profile">
            <h2>Your Profile</h2>

            <p>
                <strong>Email:</strong> {email}
            </p>

            <p>
                <strong>Username:</strong> {username}
            </p>
            <input
                type="text"
                placeholder="New username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
            />
            <button onClick={handleUsernameChange}>Change Username</button>

            <h3>Change Password</h3>
            <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>Update Password</button>

            <p>
                <strong>Quotes Rated:</strong> {quotesRated}
            </p>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default UserProfile;
