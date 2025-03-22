// Initialize Supabase
const supabase = supabase.createClient(
    "https://your-project-id.supabase.co",
    "your-anon-key"
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
