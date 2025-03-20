console.log("auth.js is loaded successfully!");

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = 'https://tspjkvhzzggrysicdein.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzcGprdmh6emdncnlzaWNkZWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTg2MzUsImV4cCI6MjA1Nzk3NDYzNX0.GozCQeyEdUVJwPVikH6tpXHAUQCPl-V50-MF9cIUCCY'; // Your full key

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Expose `supabaseClient` globally for debugging
window.supabaseClient = supabaseClient;

console.log("Supabase initialized:", supabaseClient);

// Function to Check Login Status on Page Load
async function checkUserStatus() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    console.log("User status:", user);

    const signupBtn = document.getElementById("signupBtn");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (signupBtn && loginBtn && logoutBtn) {
        if (user) {
            console.log("User is logged in. Showing logout button.");
            signupBtn.style.display = "none";
            loginBtn.style.display = "none";
            logoutBtn.style.display = "block";
        } else {
            console.log("User is not logged in. Hiding logout button.");
            signupBtn.style.display = "block";
            loginBtn.style.display = "block";
            logoutBtn.style.display = "none";
        }
    } else {
        console.warn("One or more buttons (signupBtn, loginBtn, logoutBtn) are missing in index.html");
    }
}
// Function to Sign Up
async function signUp(event) {
    event.preventDefault();
    
    const fullName = document.querySelector('#signup-fullname').value;
    const email = document.querySelector('#signup-email').value;
    const password = document.querySelector('#signup-password').value;

    if (!fullName || !email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: { data: { full_name: fullName } }
    });

    if (error) {
        alert('Signup Error: ' + error.message);
    } else {
        alert('Signup successful! Please check your email for verification.');
        closeModal('authModal'); // Fix: Close the correct modal
        checkUserStatus(); // Update UI
    }
}

// Function to Log In
async function logIn(event) {
    event.preventDefault();
    
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;

    if (!email || !password) {
        alert('Please enter your email and password.');
        return;
    }

    // Check if the user exists before logging in
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert('Invalid credentials or account not found. Please sign up first.');
        closeModal('authModal');
        openAuthModal('signup'); // Fix: Correctly switch to sign-up modal
    } else {
        alert('Login successful!');
        closeModal('authModal');
        checkUserStatus(); // Update UI
    }
}

// Function to Log Out
async function logOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        alert('Logout Error: ' + error.message);
    } else {
        alert('Logged out successfully!');
        checkUserStatus(); // Update UI
    }
}

// Function to Sign In with Google or Facebook
async function signInWithProvider(provider) {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: provider,
        options: { redirectTo: window.location.origin }
    });

    if (error) {
        alert('Error signing in with ' + provider + ': ' + error.message);
    }
}

// Function to Open Authentication Modal with Correct Form
function openAuthModal(type) {
    document.getElementById('authModal').style.display = 'block';
    toggleForm(type);
}

// Function to Switch Between Login & Signup Forms
function toggleForm(type) {
    if (type === 'signup') {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('signupForm').style.display = 'block';
        document.getElementById('modalTitle').innerText = 'Sign Up';
    } else {
        document.getElementById('signupForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('modalTitle').innerText = 'Login';
    }
}

// Function to Close Modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error(`Modal with ID "${modalId}" not found`);
    }
}


// Run the check on page load
document.addEventListener("DOMContentLoaded", checkUserStatus);
