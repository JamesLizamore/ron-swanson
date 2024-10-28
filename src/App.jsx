// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config/firebase';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import SetUsername from './components/SetUsername';
import RateQuote from './components/RateQuote';
import RatedQuotes from './components/RatedQuotes';
import UserProfile from './components/UserProfile';
import './App.css';

// Define authentication states
const AuthStates = {
    NOT_LOGGED_IN: 'NOT_LOGGED_IN',
    SET_USERNAME: 'SET_USERNAME',
    LOGGED_IN: 'LOGGED_IN',
};

function App() {
    const [authState, setAuthState] = useState(AuthStates.NOT_LOGGED_IN);

    useEffect(() => {
        // Listen to authentication state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    setAuthState(AuthStates.SET_USERNAME); // Redirect to username setup if no username
                } else {
                    setAuthState(AuthStates.LOGGED_IN); // If user exists, proceed to the main app
                }
            } else {
                setAuthState(AuthStates.NOT_LOGGED_IN); // Not logged in, show login page
            }
        });

        return () => unsubscribe(); // Cleanup the listener on component unmount
    }, []);

    if (authState === AuthStates.SET_USERNAME) {
        return <SetUsername />;
    }

    if (authState === AuthStates.NOT_LOGGED_IN) {
        return <LoginPage />;
    }

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/rate" element={<RateQuote />} />
                <Route path="/rated" element={<RatedQuotes />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="*" element={<Navigate to="/rate" />} />
            </Routes>
        </Router>
    );
}

export default App;
