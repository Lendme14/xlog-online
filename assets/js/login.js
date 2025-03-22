
// Initialize Supabase
const supabase = supabase.createClient(
    "https://your-project-id.supabase.co",
    "your-anon-key"
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
