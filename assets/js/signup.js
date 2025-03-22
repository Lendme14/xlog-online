// Initialize Supabase
const supabase = supabase.createClient(
    "https://tspjkvhzzggrysicdein.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzcGprdmh6emdncnlzaWNkZWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTg2MzUsImV4cCI6MjA1Nzk3NDYzNX0.GozCQeyEdUVJwPVikH6tpXHAUQCPl-V50-MF9cIUCCY"
);

// Handle signup
document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    const fileInput = document.getElementById('profile-pic');

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username }
        }
    });

    if (error) {
        alert(error.message);
        return;
    }

    // Upload profile picture
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const filePath = `profiles/${data.user.id}/${file.name}`;

        const { error: uploadError } = await supabase
            .storage
            .from('profile_pictures')
            .upload(filePath, file);

        if (uploadError) {
            alert("File upload failed!");
            return;
        }
    }

    // Redirect to dashboard
    window.location.href = "dashboard.html";
});
