// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import RateQuote from './components/RateQuote';
import RatedQuotes from './components/RatedQuotes';
import './App.css';

function App() {
    const [loggedIn, setLoggedIn] = useState(false); // Simple logged-in state
    const [ratedQuotes, setRatedQuotes] = useState([]); // Store rated quotes

    return (
        <Router>
            {loggedIn ? (
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
