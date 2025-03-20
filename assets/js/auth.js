console.log("auth.js is loaded successfully!");

// Initialize Supabase
const { createClient } = supabase;
const SUPABASE_URL = 'https://tspjkvhzzggrysicdein.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzcGprdmh6emdncnlzaWNkZWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTg2MzUsImV4cCI6MjA1Nzk3NDYzNX0.GozCQeyEdUVJwPVikH6tpXHAUQCPl-V50-MF9cIUCCY';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to Check Login Status on Page Load
async function checkUserStatus() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (user) {
        document.getElementById("signupBtn").style.display = "none";
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("logoutBtn").style.display = "block";
    } else {
        document.getElementById("signupBtn").style.display = "block";
        document.getElementById("loginBtn").style.display = "block";
        document.getElementById("logoutBtn").style.display = "none";
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
    document.getElementById(modalId).style.display = 'none';
}

// Run the check on page load
document.addEventListener("DOMContentLoaded", checkUserStatus);
