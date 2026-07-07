import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

// Your Firebase configuration
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
const db = getFirestore();
const storage = getStorage();
const auth = getAuth(); // Initialize auth

// Handle form submission
const form = document.getElementById('design-submit-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const designFile = document.getElementById('design').files[0];
    const description = document.getElementById('description').value;
    const termsAgreed = document.getElementById('terms').checked;

    if (!termsAgreed) {
        alert('Please agree to the terms and conditions.');
        return;
    }

    const user = auth.currentUser; // Get the current authenticated user
    if (!user) {
        alert('User not authenticated.');
        return;
    }

    // Upload design file to Firebase Storage under user-specific path
    const storageRef = ref(storage, `designs/${user.uid}/${designFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, designFile);

    try {
        // Wait for upload to complete and get the download URL
        const snapshot = await uploadTask;
        const fileURL = await getDownloadURL(snapshot.ref);

        // Save submission data to Firestore under 'designSubmissions' collection
        const submissionData = {
            userId: user.uid, // Associate submission with the user
            name: name,
            fileURL: fileURL,
            description: description,
            timestamp: new Date()
        };

        await addDoc(collection(db, 'designSubmissions'), submissionData);

        alert('Design submitted successfully!');
        form.reset();
    } catch (error) {
        console.error('Error submitting design:', error);
        alert('Failed to submit design. Please try again.');
    }
});


////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
  const generateBtn = document.getElementById('generateBtn');
  const designNameInput = document.getElementById('designName');
  const designDescriptionTextarea = document.getElementById('designDescription');
  const imageResultContainer = document.getElementById('imageResult');
  const generatedImage = document.getElementById('generatedImage');
  const downloadLink = document.getElementById('downloadLink');

  generateBtn.addEventListener('click', function() {
      const designName = designNameInput.value.trim();
      const designDescription = designDescriptionTextarea.value.trim();

      if (designName === '' || designDescription === '') {
          alert('Please enter a design name and description.');
          return;
      }

      // Replace with your API endpoint and key
      const apiUrl = 'https://app.imggen.ai/v1/generate-image';
      const apiKey = '80174266-af38-4984-9de5-deafcfda97a1';

      // Request body
      const requestBody = {
          prompt: designDescription,
          aspect_ratio: 'square', // Change this according to your needs
          samples: 1, // Number of images to generate
          model: 'imggen-base' // Specify the AI model
      };

      fetch(apiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-IMGGEN-KEY': apiKey
          },
          body: JSON.stringify(requestBody)
      })
      .then(response => response.json())
      .then(data => {
          if (data.success && data.images.length > 0) {
              const imageData = data.images[0]; // Assuming only one image is generated
              generatedImage.src = 'data:image/png;base64,' + imageData;
              imageResultContainer.classList.remove('hidden');
              downloadLink.href = 'data:image/png;base64,' + imageData;
              downloadLink.classList.remove('hidden');
          } else {
              alert('Failed to generate image. Please try again.');
          }
      })
      .catch(error => {
          console.error('Error generating image:', error);
          alert('Failed to generate image. Please try again.');
      });

      // Hide image result and download link initially
      imageResultContainer.classList.add('hidden');
      downloadLink.classList.add('hidden');
  });
});
