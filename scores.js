import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAWdNBKwegGq71gduheC91QgvL8nt8Q1Gk",
    authDomain: "circle-shooter-a79cb.firebaseapp.com",
    projectId: "circle-shooter-a79cb",
    databaseURL: "https://circle-shooter-a79cb-default-rtdb.asia-southeast1.firebasedatabase.app/",
    storageBucket: "circle-shooter-a79cb.firebasestorage.app",
    messagingSenderId: "604261657492",
    appId: "1:604261657492:web:84bf8cf2d7d88a19647d81"
  };

    const app = initializeApp(firebaseConfig);
    const database = getDatabase();


    export function updateHighestScore(uid, score) {
        const scoreRef = ref(database, `users/${uid}/highestScore`);
        set(scoreRef, score)
            .then(() => {
                console.log('Highest score updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating highest score:', error);
            });
    }
    
    // Function to retrieve the highest score for a specific user
    export function getHighestScore(uid) {
        const scoreRef = ref(database, `users/${uid}/highestScore`);
        return get(scoreRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    return snapshot.val();
                } else {
                    console.log('No highest score found for this user.');
                    return null;
                }
            })
            .catch((error) => {
                console.error('Error retrieving highest score:', error);
                return null;
            });
    }