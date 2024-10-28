// LoginPage.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            // Input validation
            if (email.trim() === '' || password.trim() === '') {
                setError('Please enter both email and password.');
                return;
            }

            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged in App.jsx will handle state updates
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="login-page">
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default LoginPage;
