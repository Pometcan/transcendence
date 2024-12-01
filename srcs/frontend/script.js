document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginErrorDiv = document.getElementById('loginError');
    const registerErrorDiv = document.getElementById('registerError');

    // Switch between login and register forms
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Login form submission
    document.getElementById('login').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Basic validation
        if (email && password) {
            // Here you would typically send a request to your server to authenticate the user
            console.log('Login attempt:', { email, password });
            loginErrorDiv.textContent = 'Login successful! (This is a mock response)';
            loginErrorDiv.style.color = '#00ff00';
        } else {
            loginErrorDiv.textContent = 'Please fill in all fields.';
        }
    });

    // Register form submission
    document.getElementById('register').addEventListener('submit', (e) => {
        e.preventDefault();
        const gamerTag = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Basic validation
        if (gamerTag && email && password && confirmPassword) {
            if (password === confirmPassword) {
                // Here you would typically send a request to your server to register the user
                console.log('Registration attempt:', { gamerTag, email, password });
                registerErrorDiv.textContent = 'Registration successful! (This is a mock response)';
                registerErrorDiv.style.color = '#00ff00';
            } else {
                registerErrorDiv.textContent = 'Passwords do not match.';
            }
        } else {
            registerErrorDiv.textContent = 'Please fill in all fields.';
        }
    });
});

