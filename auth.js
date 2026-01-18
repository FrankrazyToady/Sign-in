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

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBjUWLTD0tIUK_vfq0NIAmaagya9mNnEfc",
  authDomain: "dynamic-organization.firebaseapp.com",
  projectId: "dynamic-organization",
  storageBucket: "dynamic-organization.appspot.com",
  messagingSenderId: "574974660064",
  appId: "1:574974660064:web:69908bdc3a35ae4884ef85"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authMessage = document.getElementById('authMessage');

// --- Email/Password ---
document.getElementById('signUpButton').onclick = async () => {
  try {
    const user = await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    authMessage.textContent = `User created: ${user.user.email}`;
    authMessage.style.color = 'green';
  } catch (e) {
    authMessage.textContent = e.message;
    authMessage.style.color = 'red';
  }
};

document.getElementById('signInButton').onclick = async () => {
  try {
    const user = await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    authMessage.textContent = `Signed in: ${user.user.email}`;
    authMessage.style.color = 'green';
  } catch (e) {
    authMessage.textContent = e.message;
    authMessage.style.color = 'red';
  }
};

// --- Google Sign-In ---
const googleProvider = new GoogleAuthProvider();
document.getElementById('googleSignInButton').onclick = async () => {
  const btn = document.getElementById('googleSignInButton');
  btn.disabled = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    authMessage.textContent = `Signed in with Google: ${result.user.email}`;
    authMessage.style.color = 'green';
  } catch (e) {
    authMessage.textContent = e.message;
    authMessage.style.color = 'red';
  } finally {
    btn.disabled = false;
  }
};

// --- Phone Sign-In ---
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth);
document.getElementById('phoneSignInButton').onclick = async () => {
  const phoneNumber = document.getElementById('phoneNumber').value;
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
    const code = prompt("Enter the verification code sent to your phone:");
    const result = await confirmationResult.confirm(code);
    authMessage.textContent = `Signed in with phone: ${result.user.phoneNumber}`;
    authMessage.style.color = 'green';
  } catch (e) {
    authMessage.textContent = e.message;
    authMessage.style.color = 'red';
  }
};

// --- Sign Out ---
document.getElementById('signOutButton').onclick = async () => {
  await signOut(auth);
  authMessage.textContent = 'Signed out';
  authMessage.style.color = 'green';
};

// --- Auth State ---
onAuthStateChanged(auth, (user) => {
  if(user) {
    // Redirect to home.html after login
    window.location.href = "home.html";
  } else {
    document.getElementById('auth-forms').style.display = 'block';
    document.getElementById('user-info').style.display = 'none';
  }
});