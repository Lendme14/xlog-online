// Initialize Supabase
const supabase = supabase.createClient(
    "https://your-project-id.supabase.co",
    "your-anon-key"
);

// Function to load user profile
async function loadUserProfile() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user) {
        window.location.href = "login.html"; // Redirect to login if not logged in
        return;
    }

    document.getElementById('email-display').innerText = user.email;

    // Fetch user profile details from Supabase
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profile) {
        document.getElementById('username-display').innerText = profile.username || "No username";
        
        if (profile.profile_picture) {
            document.getElementById('profile-pic').src = 
                `https://your-project-id.supabase.co/storage/v1/object/public/profile_pictures/${profile.profile_picture}`;
        }
    } else if (profileError) {
        console.error("Profile fetch error:", profileError.message);
    }
}

// Function to update user profile
document.getElementById('update-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const newUsername = document.getElementById('new-username').value;
    const newProfilePic = document.getElementById('new-profile-pic').files[0];

    const { data: { user } } = await supabase.auth.getUser();

    // Update username
    if (newUsername) {
        await supabase
            .from('profiles')
            .update({ username: newUsername })
            .eq('id', user.id);
    }

    // Upload new profile picture
    if (newProfilePic) {
        const filePath = `profiles/${user.id}/${newProfilePic.name}`;

        const { error: uploadError } = await supabase
            .storage
            .from('profile_pictures')
            .upload(filePath, newProfilePic, { upsert: true });

        if (!uploadError) {
            await supabase
                .from('profiles')
                .update({ profile_picture: filePath })
                .eq('id', user.id);
        }
    }

    alert("Profile updated successfully!");
    loadUserProfile(); // Reload profile after update
});

// Logout Function
document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = "login.html";
});

// Load profile when the page loads
loadUserProfile();
