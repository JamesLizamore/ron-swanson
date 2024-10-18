// src/utils/deleteUnratedQuotes.js
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";

export const deleteUnratedQuotes = async () => {
    try {
        const quotesCollection = collection(db, "quotes");
        const ratingsCollection = collection(db, "ratings");

        const quotesSnapshot = await getDocs(quotesCollection);
        const ratedQuotesIds = new Set();

        const ratingsSnapshot = await getDocs(ratingsCollection);
        ratingsSnapshot.forEach(doc => {
            const data = doc.data();
            ratedQuotesIds.add(data.quoteId);
        });

        const deletePromises = [];
        quotesSnapshot.forEach((quoteDoc) => {
            if (!ratedQuotesIds.has(quoteDoc.id)) {
                deletePromises.push(deleteDoc(doc(db, "quotes", quoteDoc.id)));
            }
        });

        await Promise.all(deletePromises);
        return true;
    } catch (error) {
        console.error("Error deleting unrated quotes:", error);
        return false;
    }
};
