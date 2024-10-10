import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RateQuote({ setRatedQuotes, ratedQuotes }) {
    const [quote, setQuote] = useState('');
    const [rating, setRating] = useState(0); // The confirmed rating
    const [hoverRating, setHoverRating] = useState(0); // The hover state for rating

    const getQuote = async () => {
        const response = await axios.get('https://ron-swanson-quotes.herokuapp.com/v2/quotes');
        setQuote(response.data[0]);
        setRating(0); // Reset the rating when a new quote is fetched
        setHoverRating(0); // Reset hover rating as well
    };

    const handleSubmitRating = () => {
        const newRatedQuote = { quote, rating };
        setRatedQuotes([...ratedQuotes, newRatedQuote]);
        getQuote(); // Fetch a new quote after rating
    };

    useEffect(() => {
        getQuote();
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
                        onClick={() => setRating(star)} // Update rating when clicked
                        onMouseEnter={() => setHoverRating(star)} // Show hover rating
                        onMouseLeave={() => setHoverRating(0)} // Reset hover rating when not hovering
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
