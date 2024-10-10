// components/RatedQuotes.jsx
import React from 'react';

function RatedQuotes({ ratedQuotes }) {
    return (
        <div className="rated-quotes-list">
            <h2>Rated Quotes</h2>
            {ratedQuotes.length > 0 ? (
                ratedQuotes.map((quoteObj, index) => (
                    <div key={index} className="rated-quote-card">
                        <p className="quote-text">{quoteObj.quote}</p>
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className={star <= quoteObj.rating ? 'star filled' : 'star'}>
                  ★
                </span>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>No rated quotes yet.</p>
            )}
        </div>
    );
}

export default RatedQuotes;
