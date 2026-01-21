import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- Firebase config ---
const firebaseConfig = {
  apiKey: "AIzaSyBjUWLTD0tIUK_vfq0NIAmaagya9mNnEfc",
  authDomain: "dynamic-organization.firebaseapp.com",
  projectId: "dynamic-organization",
  storageBucket: "dynamic-organization.appspot.com",
  messagingSenderId: "574974660064",
  appId: "1:574974660064:web:69908bdc3a35ae4884ef85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- UI Elements ---
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authMessage = document.getElementById('authMessage');

// --- Email/Password Sign Up ---
document.getElementById('signUpButton').onclick = async () => {
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    authMessage.textContent = "Account created successfully!";
    authMessage.style.color = "green";
  } catch(e) {
    authMessage.textContent = "Sign up failed. Please try again.";
    authMessage.style.color = "red";
    console.error(e.message);
  }
};

// --- Email/Password Sign In ---
document.getElementById('signInButton').onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    authMessage.textContent = "Signed in successfully!";
    authMessage.style.color = "green";
  } catch(e) {
    authMessage.textContent = "Login failed. Please check your credentials.";
    authMessage.style.color = "red";
    console.error(e.message);
  }
};

// --- Google Sign-In ---
const googleProvider = new GoogleAuthProvider();
document.getElementById('googleSignInButton').onclick = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    authMessage.textContent = "Signed in with Google!";
    authMessage.style.color = "green";
  } catch(e) {
    authMessage.textContent = "Google sign-in failed.";
    authMessage.style.color = "red";
    console.error(e.message);
  }
};

// --- Phone Sign-In ---
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth);
document.getElementById('phoneSignInButton').onclick = async () => {
  const phoneNumber = document.getElementById('phoneNumber').value;
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
    authMessage.textContent = "Verification code sent!";
    authMessage.style.color = "green";

    // Use input field instead of prompt
    document.getElementById('confirmCodeButton').onclick = async () => {
      const code = document.getElementById('verificationCode').value;
      try {
        await confirmationResult.confirm(code);
        authMessage.textContent = "Phone sign-in successful!";
        authMessage.style.color = "green";
      } catch(err) {
        authMessage.textContent = "Invalid verification code.";
        authMessage.style.color = "red";
        console.error(err.message);
      }
    };
  } catch(e) {
    authMessage.textContent = "Phone sign-in failed.";
    authMessage.style.color = "red";
    console.error(e.message);
  }
};

// --- Auth State Listener (redirects to home.html) ---
onAuthStateChanged(auth, (user) => {
  if(user) {
    setTimeout(() => {
      window.location.href = "home.html";
    }, 1000); // short delay for message visibility
  }
});