import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZCyBIw69gdh1_J_Rxfy_GylwsTlgZmvM",
    authDomain: "ecochic-a0b75.firebaseapp.com",
    projectId: "ecochic-a0b75",
    storageBucket: "ecochic-a0b75.appspot.com",
    messagingSenderId: "656140390622",
    appId: "1:656140390622:web:6d3303d786c88bc213324f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

// Function to calculate and display coins
const calculateAndDisplayCoins = () => {
    const age = document.getElementById('age').value;
    const coins = 275 * age;
    document.getElementById('coinsDisplay').textContent = `Coins: ${coins}`;
};

// Function to validate date input
const isDateValid = (inputDate) => {
    const currentDate = new Date();
    const selectedDate = new Date(inputDate);
    return selectedDate >= currentDate;
};

// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is authenticated, proceed with storage operations
        const donationForm = document.getElementById('donationForm');
        const ageInput = document.getElementById('age');
        const dateInput = document.getElementById('date');

        // Calculate and display coins when age is input
        ageInput.addEventListener('input', calculateAndDisplayCoins);

        // Prevent form submission if date has passed
        donationForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const fileInput = document.getElementById('design');
            const age = document.getElementById('age').value;
            const address = document.getElementById('address').value;
            const date = document.getElementById('date').value;

            // Validate date
            if (!isDateValid(date)) {
                alert('Please select a future date.');
                return;
            }

            const coins = 275 * age;

            const file = fileInput.files[0];
            let fileURL = '';

            if (file) {
                const storageRef = ref(storage, `uploads/${user.uid}/${file.name}`);

                try {
                    await uploadBytes(storageRef, file);
                    fileURL = await getDownloadURL(storageRef);
                } catch (error) {
                    console.error('Error uploading file: ', error);
                    alert('Error uploading file, please try again.');
                    return;
                }
            }

            try {
                await addDoc(collection(db, 'donations'), {
                    userId: user.uid,
                    name: name,
                    fileURL: fileURL,
                    age: age,
                    address: address,
                    date: date,
                    coins: coins, // Add coins to the database
                    timestamp: new Date()
                });

                alert('Donation submitted successfully!');
                donationForm.reset();
                document.getElementById('coinsDisplay').textContent = ''; // Clear coins display
            } catch (error) {
                console.error('Error adding document: ', error);
                alert('Error submitting donation, please try again.');
            }
        });
    } else {
        // No user is signed in, redirect to login page or handle as needed
        window.location.href = '/EcoChic/weforshe/index.html';
    }
});
