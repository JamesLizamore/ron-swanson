import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const RatedQuotes = () => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const ratingsCollection = collection(db, 'ratings');
                const ratingsSnapshot = await getDocs(ratingsCollection);
                const ratingsData = {};

                for (const ratingDoc of ratingsSnapshot.docs) {
                    const ratingData = ratingDoc.data();

                    // Fetch the corresponding quote using the quoteId
                    let quoteId = ratingData.quoteId.includes('/')
                        ? ratingData.quoteId.split('/').pop()
                        : ratingData.quoteId;
                    const quoteRef = doc(db, 'quotes', quoteId);
                    const quoteSnap = await getDoc(quoteRef);

                    // Fetch the corresponding username using the userId
                    const userRef = doc(db, 'users', ratingData.userId);
                    const userSnap = await getDoc(userRef);
                    const username = userSnap.exists() ? userSnap.data().username : 'Unknown User';

                    if (quoteSnap.exists()) {
                        if (!ratingsData[quoteId]) {
                            ratingsData[quoteId] = {
                                quoteText: quoteSnap.data().text,
                                totalRating: 0,
                                ratingsCount: 0,
                                userRatings: [],
                            };
                        }
                        ratingsData[quoteId].totalRating += ratingData.rating;
                        ratingsData[quoteId].ratingsCount++;
                        ratingsData[quoteId].userRatings.push({
                            username,
                            rating: ratingData.rating,
                        });
                    } else {
                        console.error("Quote not found for rating:", ratingDoc.id);
                    }
                }

                const formattedRatings = Object.keys(ratingsData).map((quoteId) => ({
                    quoteId,
                    quoteText: ratingsData[quoteId].quoteText,
                    averageRating: (ratingsData[quoteId].totalRating / ratingsData[quoteId].ratingsCount).toFixed(1),
                    userRatings: ratingsData[quoteId].userRatings,
                }));

                setRatings(formattedRatings);
                setLoading(false);  // Stop loading
            } catch (error) {
                console.error("Error fetching ratings:", error);
            }
        };

        fetchRatings();
    }, []);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
                ★
            </span>
        ));
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="rated-quotes-list">
            <h1>Rated Quotes</h1>
            {ratings.length > 0 ? (
                ratings.map((rating, index) => (
                    <div key={index} className="rated-quote-card">
                        <p className="quote-text">"{rating.quoteText}"</p>
                        <div className="rating-display">
                            <span>Average Rating: {rating.averageRating}</span>
                            {renderStars(Math.round(rating.averageRating))}
                        </div>
                        <div className="user-ratings-dropdown">
                            <details>
                                <summary>User Ratings</summary>
                                <ul>
                                    {rating.userRatings.map((userRating, i) => (
                                        <li key={i}>
                                            {userRating.username}: {userRating.rating} {renderStars(userRating.rating)}
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        </div>
                    </div>
                ))
            ) : (
                <p>No rated quotes found.</p>
            )}
        </div>
    );
};

export default RatedQuotes;
