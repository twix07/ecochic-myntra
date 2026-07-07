import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getStorage, ref, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBZCyBIw69gdh1_J_Rxfy_GylwsTlgZmvM",
    authDomain: "ecochic-a0b75.firebaseapp.com",
    projectId: "ecochic-a0b75",
    storageBucket: "ecochic-a0b75.appspot.com",
    messagingSenderId: "656140390622",
    appId: "1:656140390622:web:6d3303d786c88bc213324f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

// Function to render user clothes
const renderClothes = async (user) => {
    const userClothesContainer = document.getElementById('userClothes');
    userClothesContainer.innerHTML = '';

    let totalCoins = 0;

    // Fetch user document from Firestore to get first name and totalCoins
    try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const firstName = userData.firstName; // Assuming 'firstName' is a field in your user document

            // Update the UI with the fetched first name
            document.getElementById('usernamePlaceholder').textContent = firstName;

            if (userData.totalCoins !== undefined) {
                document.getElementById('totalCoins').innerHTML = `<strong>${userData.totalCoins}</strong> Coins Earned`;
            } else {
                document.getElementById('totalCoins').innerHTML = `<strong>0</strong> Coins Earned`;
            }
        } else {
            console.error('User document not found');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }

    // Fetch clothes data from Firestore for the logged-in user
    try {
        const q = query(collection(db, 'donations'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const pickupDate = new Date(data.date);
            const today = new Date();

            const age = parseInt(data.age);
            const coinsEarned = 275 * age;

            const clothesDiv = document.createElement('div');
            clothesDiv.classList.add('category');

            if (pickupDate < today) {
                // Display picked-up clothes
                totalCoins += coinsEarned;

                clothesDiv.innerHTML = `
                    <img src="${data.fileURL}" alt="Clothes Image">
                    <h3>${data.name}</h3>
                    <p>${data.age} years old</p>
                    <p>Picked up on: ${data.date}</p>
                    <p>Coins Earned: ${coinsEarned}</p>
                `;
            } else {
                // Display clothes waiting for pickup
                clothesDiv.innerHTML = `
                    <img src="${data.fileURL}" alt="Clothes Image">
                    <h3>${data.name}</h3>
                    <p>${data.age} years old</p>
                    <p>Pickup Date: ${data.date}</p>
                    <button class="cancel-button" data-id="${doc.id}" data-url="${data.fileURL}">Cancel</button>
                `;
            }

            userClothesContainer.appendChild(clothesDiv);
        });
    } catch (error) {
        console.error('Error fetching clothes data:', error);
    }

    // Update totalCoins in Firestore and display in UI
    try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
            totalCoins: totalCoins
        });

        document.getElementById('totalCoins').innerHTML = `<strong>${totalCoins}</strong> Coins Earned`;
    } catch (error) {
        console.error('Error updating totalCoins:', error);
    }

    // Add event listeners to cancel buttons
    const cancelButtons = document.querySelectorAll('.cancel-button');
    cancelButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
            const docId = event.target.getAttribute('data-id');
            const fileURL = event.target.getAttribute('data-url');
            await deleteCloth(user, docId, fileURL);
            renderClothes(user);  // Refresh the list after cancellation
        });
    });
};

// Function to delete cloth
const deleteCloth = async (user, docId, fileURL) => {
    try {
        // Delete the document from Firestore
        await deleteDoc(doc(db, 'donations', docId));

        // Delete the file from Firebase Storage
        const fileRef = ref(storage, fileURL);
        await deleteObject(fileRef);

        alert('Donation cancelled successfully!');
    } catch (error) {
        console.error('Error cancelling donation: ', error);
        alert('Error cancelling donation, please try again.');
    }
};

// Check if user is authenticated
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            // Fetch user document from Firestore
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                const firstName = userData.firstName;
                const totalCoins = userData.totalCoins;

                // Update UI elements
                document.getElementById('usernamePlaceholder').textContent = firstName;
                document.getElementById('totalCoins').innerHTML = `<strong>${totalCoins}</strong> Coins Earned`;

                // Render user's clothes
                renderClothes(user);
            } else {
                console.error('User document does not exist.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    } else {
        // No user is signed in, redirect to login page or handle as needed
        window.location.href = '/EcoChic/weforshe/index.html';
    }
});
