// RatedQuotes.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, query } from 'firebase/firestore';
import { db } from '../config/firebase';

const RatedQuotes = () => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                // Fetch all ratings
                const ratingsSnapshot = await getDocs(collection(db, 'ratings'));
                const ratingsData = {};

                // Group ratings by quoteId
                ratingsSnapshot.docs.forEach((ratingDoc) => {
                    const data = ratingDoc.data();
                    const { quoteId, userId, rating } = data;

                    if (!ratingsData[quoteId]) {
                        ratingsData[quoteId] = {
                            totalRating: 0,
                            ratingsCount: 0,
                            userRatings: [],
                        };
                    }

                    ratingsData[quoteId].totalRating += rating;
                    ratingsData[quoteId].ratingsCount++;
                    ratingsData[quoteId].userRatings.push({ userId, rating });
                });

                // Fetch all quotes and users in batches
                const quoteIds = Object.keys(ratingsData);
                const quotesPromises = quoteIds.map((id) => getDoc(doc(db, 'quotes', id)));
                const quotesSnapshots = await Promise.all(quotesPromises);

                const userIds = [
                    ...new Set(
                        ratingsSnapshot.docs.map((doc) => doc.data().userId)
                    ),
                ];
                const usersPromises = userIds.map((id) => getDoc(doc(db, 'users', id)));
                const usersSnapshots = await Promise.all(usersPromises);

                const quotesMap = {};
                quotesSnapshots.forEach((snap) => {
                    if (snap.exists()) {
                        quotesMap[snap.id] = snap.data().text;
                    }
                });

                const usersMap = {};
                usersSnapshots.forEach((snap) => {
                    if (snap.exists()) {
                        usersMap[snap.id] = snap.data().username;
                    }
                });

                const formattedRatings = quoteIds.map((quoteId) => {
                    const quoteText = quotesMap[quoteId] || 'Unknown Quote';
                    const { totalRating, ratingsCount, userRatings } = ratingsData[quoteId];
                    const averageRating = (totalRating / ratingsCount).toFixed(1);

                    const userRatingsWithNames = userRatings.map((ur) => ({
                        username: usersMap[ur.userId] || 'Unknown User',
                        rating: ur.rating,
                    }));

                    return {
                        quoteId,
                        quoteText,
                        averageRating,
                        userRatings: userRatingsWithNames,
                    };
                });

                setRatings(formattedRatings);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching ratings:', error);
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
                                            {userRating.username}: {userRating.rating}{' '}
                                            {renderStars(userRating.rating)}
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
