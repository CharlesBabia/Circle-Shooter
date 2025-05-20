  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
  import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
  import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-database.js";
  import { setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAWdNBKwegGq71gduheC91QgvL8nt8Q1Gk",
    authDomain: "circle-shooter-a79cb.firebaseapp.com",
    projectId: "circle-shooter-a79cb",
    storageBucket: "circle-shooter-a79cb.firebasestorage.app",
    messagingSenderId: "604261657492",
    appId: "1:604261657492:web:84bf8cf2d7d88a19647d81"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase();
  const auth = getAuth(app);
  auth.language = 'it';
  const provider = new GoogleAuthProvider();

  document.addEventListener('DOMContentLoaded', () => {
    const login = document.getElementById("login");
    const register = document.getElementById("register");
    const googlelogin = document.getElementById("login-google");
  
    if (login) {
      login.addEventListener('click', function (event) {
        event.preventDefault();
  
        const email = document.getElementById("username").value;
        const password = document.getElementById("password").value;
  
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            window.location.href = "game.html";
          })
          .catch((error) => {
            alert(error.message);
          });
      });
    }
  
    if (register) {
      register.addEventListener('click', function (event) {
        event.preventDefault();
  
        const email = document.getElementById("username").value;
        const password = document.getElementById("password").value;
  
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            alert("Signed Up! Sign in Now to Play");
          })
          .catch((error) => {
            alert(error.message);
          });
      });
    }
  
    if (googlelogin) {
      googlelogin.addEventListener('click', function (event) {
        event.preventDefault();
  
        signInWithPopup(auth, provider)
          .then((result) => {
            // Signed in with Google
            window.location.href = "game.html";
          })
          .catch((error) => {
            alert(error.message);
          });
      });
    }
  });

  setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Authentication state persistence is set to local.");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });



