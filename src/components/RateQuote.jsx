// RateQuote.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

function RateQuote() {
    const [quote, setQuote] = useState('');
    const [quoteId, setQuoteId] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const fetchUnratedQuote = async () => {
        try {
            const userId = auth.currentUser.uid;

            // Fetch quotes rated by the user
            const userRatingsQuery = query(
                collection(db, 'ratings'),
                where('userId', '==', userId)
            );
            const userRatingsSnapshot = await getDocs(userRatingsQuery);
            const ratedQuoteIds = userRatingsSnapshot.docs.map((doc) => doc.data().quoteId);

            // Fetch all quotes
            const allQuotesSnapshot = await getDocs(collection(db, 'quotes'));
            const unratedQuotes = allQuotesSnapshot.docs.filter(
                (quoteDoc) => !ratedQuoteIds.includes(quoteDoc.id)
            );

            if (unratedQuotes.length > 0) {
                // Select a random unrated quote
                const randomQuoteDoc =
                    unratedQuotes[Math.floor(Math.random() * unratedQuotes.length)];
                setQuote(randomQuoteDoc.data().text);
                setQuoteId(randomQuoteDoc.id);
            } else {
                // Fetch a new quote from the API
                await getQuoteFromAPI();
            }

            setRating(0);
            setHoverRating(0);
        } catch (error) {
            console.error('Error fetching unrated quote:', error);
        }
    };

    const getQuoteFromAPI = async () => {
        try {
            const response = await axios.get(
                'https://ron-swanson-quotes.herokuapp.com/v2/quotes'
            );
            const quoteText = response.data[0];

            // Check if the quote already exists
            const quotesQuery = query(
                collection(db, 'quotes'),
                where('text', '==', quoteText)
            );
            const quotesSnapshot = await getDocs(quotesQuery);

            if (!quotesSnapshot.empty) {
                const existingQuoteDoc = quotesSnapshot.docs[0];
                setQuoteId(existingQuoteDoc.id);
                setQuote(quoteText);
            } else {
                // Add new quote to Firestore
                const newQuoteDoc = await addDoc(collection(db, 'quotes'), {
                    text: quoteText,
                });
                setQuoteId(newQuoteDoc.id);
                setQuote(quoteText);
            }
        } catch (error) {
            console.error('Error fetching quote from API:', error);
        }
    };

    const handleSubmitRating = async () => {
        try {
            if (rating === 0) {
                alert('Please select a rating.');
                return;
            }

            await addDoc(collection(db, 'ratings'), {
                quoteId: quoteId,
                userId: auth.currentUser.uid,
                rating: rating,
            });

            // Fetch the next unrated quote
            fetchUnratedQuote();
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    useEffect(() => {
        fetchUnratedQuote();
    }, []);

    return (
        <div className="quote-card">
            <img src="https://i.imgur.com/vyLGZpj.png" alt="Ron Swanson" className="ron-image" />
            <p className="quote-text">{quote}</p>
            <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={star <= (hoverRating || rating) ? 'star filled' : 'star'}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                    >
            ★
          </span>
                ))}
            </div>
            <button onClick={handleSubmitRating} disabled={rating === 0} className="submit-button">
                Submit Rating
            </button>
        </div>
    );
}

export default RateQuote;
