import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';  // Import Firebase auth state listener
import { doc, getDoc } from 'firebase/firestore';  // Import Firestore
import { auth, db } from './config/firebase';  // Import Firebase auth and Firestore
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import SetUsername from './components/SetUsername';
import RateQuote from './components/RateQuote';
import RatedQuotes from './components/RatedQuotes';
import './App.css';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [ratedQuotes, setRatedQuotes] = useState([]);

    useEffect(() => {
        // Listen to authentication state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    setLoggedIn('set-username');  // Redirect to username setup if no username
                } else {
                    setLoggedIn(true);  // If user exists, proceed to the main app
                }
            } else {
                setLoggedIn(false);  // Not logged in, show login page
            }
        });

        return () => unsubscribe();  // Cleanup the listener on component unmount
    }, []);

    return (
        <Router>
            {loggedIn === 'set-username' ? (
                <SetUsername setLoggedIn={setLoggedIn} />  // Show the SetUsername page
            ) : loggedIn ? (
                <>
                    <Navbar setLoggedIn={setLoggedIn} />
                    <Routes>
                        <Route path="/rate" element={<RateQuote setRatedQuotes={setRatedQuotes} ratedQuotes={ratedQuotes} />} />
                        <Route path="/rated" element={<RatedQuotes ratedQuotes={ratedQuotes} />} />
                        <Route path="*" element={<Navigate to="/rate" />} />
                    </Routes>
                </>
            ) : (
                <LoginPage setLoggedIn={setLoggedIn} />
            )}
        </Router>
    );
}

export default App;
