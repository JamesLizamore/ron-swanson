// components/LoginPage.jsx
import React from 'react';

function LoginPage({ setLoggedIn }) {
    const handleLogin = () => {
        // For demonstration, assume the user is logged in after clicking
        setLoggedIn(true);
    };

    return (
        <div className="login-page">
            <h2>Login</h2>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default LoginPage;
