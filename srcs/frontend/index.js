

// Kullanıcı verilerini saklamak için geçici bir yer
const users = [];

function toggleForm(formType) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (formType === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (!name || !email || !password) {
        alert("Lütfen tüm alanları doldurun.");
        return;
    }

    // Kullanıcıyı kaydet
    users.push({ name, email, password });
    alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
    toggleForm('login');
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert("Lütfen tüm alanları doldurun.");
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert(`Hoş geldiniz, ${user.name}!`);
    } else {
        alert("E-posta veya şifre yanlış.");
    }
}