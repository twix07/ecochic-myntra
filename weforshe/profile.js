import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, getDoc, doc, deleteDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getStorage, ref, listAll, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBZCyBIw69gdh1_J_Rxfy_GylwsTlgZmvM",
    authDomain: "ecochic-a0b75.firebaseapp.com",
    databaseURL: "https://ecochic-a0b75-default-rtdb.firebaseio.com",
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

onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById('profileUserFName').innerText = userData.firstName;
                    document.getElementById('profileUserEmail').innerText = userData.email;
                    document.getElementById('profileUserLName').innerText = userData.lastName;
                    // Display Total Coins
                    if (userData.totalCoins !== undefined) {
                        document.getElementById('profileUserCoins').innerText = userData.totalCoins.toString();
                    } else {
                        document.getElementById('profileUserCoins').innerText = "N/A"; // Handle if totalCoins is not defined
                    }
                } else {
                    console.log("No document found matching id");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    } else {
        console.log("User Id not found in Local Storage");
    }
});

// Function to delete all user photos from Storage
async function deleteAllUserPhotos(user) {
    const storageRef = ref(storage, `uploads/${user.uid}`);
    try {
        const listResult = await listAll(storageRef);
        const deletePromises = listResult.items.map((item) => deleteObject(item));
        await Promise.all(deletePromises);
        console.log('All user photos deleted from storage');
    } catch (error) {
        console.error('Error deleting user photos from storage:', error);
        throw error;
    }
}

// Function to delete all user donations from Firestore
async function deleteAllUserDonations(user) {
    try {
        const querySnapshot = await getDocs(collection(db, 'donations'));
        const deletePromises = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === user.uid) {
                deletePromises.push(deleteDoc(doc.ref));
            }
        });
        await Promise.all(deletePromises);
        console.log('All user donations deleted from Firestore');
    } catch (error) {
        console.error('Error deleting user donations from Firestore:', error);
        throw error;
    }
}

// Function to delete all user design photos from Storage
async function deleteAllUserDesignPhotos(user) {
    const storageRef = ref(storage, `designs/${user.uid}`);
    try {
        const listResult = await listAll(storageRef);
        const deletePromises = listResult.items.map((item) => deleteObject(item));
        await Promise.all(deletePromises);
        console.log('All user design photos deleted from storage');
    } catch (error) {
        console.error('Error deleting user design photos from storage:', error);
        throw error; // Rethrow the error to handle it in the caller function
    }
}


// Function to delete all user design submissions from Firestore
async function deleteAllUserDesignSubmissions(user) {
    try {
        const querySnapshot = await getDocs(collection(db, 'designSubmissions'));
        const deletePromises = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === user.uid) {
                deletePromises.push(deleteDoc(doc.ref));
            }
        });
        await Promise.all(deletePromises);
        console.log('All user design submissions deleted from Firestore');
    } catch (error) {
        console.error('Error deleting user design submissions from Firestore:', error);
        throw error; // Rethrow the error to handle it in the caller function
    }
}


// Function to handle delete account button click
const deleteAccountButton = document.getElementById('deleteAccount');
deleteAccountButton.addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        const user = auth.currentUser;
        const userId = user.uid;

        try {
            // Step 1: Delete all photos from Storage
            await deleteAllUserPhotos(user);

            // Step 2: Delete all design photos from Storage
            await deleteAllUserDesignPhotos(user);

            // Step 3: Delete all design submissions from Firestore
            await deleteAllUserDesignSubmissions(user);

            // Step 4: Delete all donations from Firestore
            await deleteAllUserDonations(user);

            // Step 5: Delete user data from Firestore users collection
            const userDocRef = doc(db, 'users', userId);
            await deleteDoc(userDocRef);

            // Step 6: Delete the Firebase Authentication user account
            await deleteUser(user);

            console.log('User account, data, and associated resources deleted successfully');
            // Redirect to login or home page after deletion
            window.location.href = '/EcoChic/weforshe/index.html';
        } catch (error) {
            console.error('Error deleting user account and data:', error);
            alert('Failed to delete user account and data. Please try again later.');
        }
    }
});



const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
        .then(() => {
            window.location.href = '/EcoChic/weforshe/index.html';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
});
