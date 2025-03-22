
// Initialize Supabase
const supabase = supabase.createClient(
    "https://tspjkvhzzggrysicdein.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzcGprdmh6emdncnlzaWNkZWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTg2MzUsImV4cCI6MjA1Nzk3NDYzNX0.GozCQeyEdUVJwPVikH6tpXHAUQCPl-V50-MF9cIUCCY"
);

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Sign in user
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert("Login failed: " + error.message);
        return;
    }

    // Redirect to dashboard
    window.location.href = "dashboard.html";
});
