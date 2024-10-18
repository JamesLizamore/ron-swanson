import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import SetUsername from './components/SetUsername';  // Import SetUsername component
import RateQuote from './components/RateQuote';
import RatedQuotes from './components/RatedQuotes';
import './App.css';

function App() {
    const [loggedIn, setLoggedIn] = useState(false); // Use a string state for 'set-username' or true/false
    const [ratedQuotes, setRatedQuotes] = useState([]);

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
