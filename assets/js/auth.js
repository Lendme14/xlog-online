// Initialize Supabase
const { createClient } = supabase;
const SUPABASE_URL = 'https://tspjkvhzzggrysicdein.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzcGprdmh6emdncnlzaWNkZWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTg2MzUsImV4cCI6MjA1Nzk3NDYzNX0.GozCQeyEdUVJwPVikH6tpXHAUQCPl-V50-MF9cIUCCY';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check login status on page load
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

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: { data: { full_name: fullName } }
    });

    if (error) {
        alert('Signup Error: ' + error.message);
    } else {
        alert('Signup successful! Please check your email for verification.');
        closeModal('signupModal');
        checkUserStatus(); // Update UI
    }
}

// Function to Log In
async function logIn(event) {
    event.preventDefault();
    
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert('Login Error: ' + error.message);
    } else {
        alert('Login successful!');
        closeModal('loginModal');
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

// Run the check on page load
document.addEventListener("DOMContentLoaded", checkUserStatus);
