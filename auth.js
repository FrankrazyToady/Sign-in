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
  } catch(e) {
    authMessage.textContent = e.message;
    authMessage.style.color = 'red';
  }
};

// --- Email/Password Sign In ---
document.getElementById('signInButton').onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
  } catch(e) {
    authMessage.textContent = e.message;
    authMessage.style.color = 'red';
  }
};

// --- Google Sign-In ---
const googleProvider = new GoogleAuthProvider();
document.getElementById('googleSignInButton').onclick = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch(e) {
    authMessage.textContent = e.message;
    authMessage.style.color = 'red';
  }
};

// --- Phone Sign-In ---
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth);
document.getElementById('phoneSignInButton').onclick = async () => {
  const phoneNumber = document.getElementById('phoneNumber').value;
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
    const code = prompt("Enter the verification code sent to your phone:");
    await confirmationResult.confirm(code);
  } catch(e) {
    authMessage.textContent = e.message;
    authMessage.style.color = 'red';
  }
};

// --- Auth State Listener (redirects to home.html) ---
onAuthStateChanged(auth, (user) => {
  if(user) {
    // Redirect after login
    window.location.href = "home.html";
  }
});