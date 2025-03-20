const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.querySelector('.container');

// Supabase initialization
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-anon-key';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

// Sign Up
const signUpForm = document.getElementById('signUpForm');
signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signUpName').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;

    const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        alert(error.message);
    } else {
        alert('Sign-up successful! Please check your email to confirm your account.');
    }
});

// Sign In
const signInForm = document.getElementById('signInForm');
signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    const { user, error } = await supabase.auth.signIn({
        email: email,
        password: password
    });

    if (error) {
        alert(error.message);
    } else {
        alert('Sign-in successful!');
    }
});
