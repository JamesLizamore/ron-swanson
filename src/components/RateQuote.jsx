import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { collection,addDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../config/firebase'; // Firestore and Firebase auth

function RateQuote({ setRatedQuotes, ratedQuotes }) {
    const [quote, setQuote] = useState(''); // The quote text
    const [quoteId, setQuoteId] = useState(null); // Firestore document ID of the quote
    const [rating, setRating] = useState(0); // The confirmed rating
    const [hoverRating, setHoverRating] = useState(0); // The hover state for rating
    const [unratedQuotes, setUnratedQuotes] = useState([]); // Quotes not yet rated by the user

    // Step 1: Fetch Quotes Rated by Others but Not by the Current User
    const fetchUnratedQuotes = async () => {
        try {
            const userId = auth.currentUser.uid;

            // 1. Fetch all ratings of the current user
            const userRatingsCollection = collection(db, 'ratings');
            const userRatingsQuery = query(userRatingsCollection, where('userId', '==', userId));
            const userRatingsSnapshot = await getDocs(userRatingsQuery);

            const ratedQuoteIds = userRatingsSnapshot.docs.map((doc) => doc.data().quoteId);

            // 2. Fetch quotes that have been rated by other users, but not by the current user
            const quotesCollection = collection(db, 'quotes');
            const allQuotesSnapshot = await getDocs(quotesCollection);

            const unratedByUser = allQuotesSnapshot.docs.filter((quoteDoc) => {
                const quoteId = quoteDoc.id;
                return !ratedQuoteIds.includes(quoteId); // Only keep quotes not rated by the user
            });

            // 3. Randomize and set the unrated quotes
            setUnratedQuotes(unratedByUser.map((doc) => ({ id: doc.id, ...doc.data() })));

            if (unratedByUser.length > 0) {
                const randomQuote = unratedByUser[Math.floor(Math.random() * unratedByUser.length)];
                setQuote(randomQuote.data().text);
                setQuoteId(randomQuote.id);
            } else {
                // No unrated quotes available, fetch new quote from the API
                getQuoteFromAPI();
            }
        } catch (error) {
            console.error("Error fetching unrated quotes: ", error);
        }
    };

    // Fetch a random quote from the Ron Swanson API if no unrated quotes are found
    const getQuoteFromAPI = async () => {
        try {
            const response = await axios.get('https://ron-swanson-quotes.herokuapp.com/v2/quotes');
            const quoteText = response.data[0];

            // Check if the quote already exists in Firestore
            const quotesCollection = collection(db, "quotes");
            const q = query(quotesCollection, where("text", "==", quoteText));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // If the quote already exists, use its Firestore document ID
                const existingQuote = querySnapshot.docs[0];
                setQuoteId(existingQuote.id);
                setQuote(quoteText);
            } else {
                // If the quote doesn't exist, add it to Firestore with an auto-generated document ID
                const docRef = await addDoc(quotesCollection, { text: quoteText });
                setQuoteId(docRef.id);
                setQuote(quoteText);
            }

            setRating(0); // Reset the rating when a new quote is fetched
            setHoverRating(0); // Reset hover rating as well
        } catch (error) {
            console.error("Error fetching quote from API: ", error);
        }
    };

    // Submit the user's rating for the quote
    const handleSubmitRating = async () => {
        try {
            const ratingsCollection = collection(db, 'ratings');
            await addDoc(ratingsCollection, {
                quoteId: quoteId,  // Reference the quote's document ID
                userId: auth.currentUser.uid,  // Current logged-in user's ID
                rating: rating  // The user's rating for the quote
            });

            // Store the rating locally
            const newRatedQuote = { quote, rating };
            setRatedQuotes([...ratedQuotes, newRatedQuote]);

            // Fetch a new unrated quote after submitting the rating
            fetchUnratedQuotes();
        } catch (error) {
            console.error("Error submitting rating: ", error);
        }
    };

    useEffect(() => {
        fetchUnratedQuotes(); // Fetch quotes not rated by the user when the component loads
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
                        onClick={() => setRating(star)}  // Update rating when clicked
                        onMouseEnter={() => setHoverRating(star)}  // Show hover rating
                        onMouseLeave={() => setHoverRating(0)}  // Reset hover rating
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
