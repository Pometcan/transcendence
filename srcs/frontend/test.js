//import CSRFTokenManager from "./CSRFTokenManager";

// CSRF token'i al
//xconst csrfToken = CSRFTokenManager();

// testBtn'e tıklandığında test() fonksiyonunu çalıştır
const testBtn = document.getElementById("test").addEventListener('click', test());

const test2Btn = document.getElementById("test2").addEventListener('click', test2());

function test() {
    fetch("https://api.senyilma.com/test/OrnekVeriAtma/")
        .then(response => response.json())
        .then(data => {
            console.log(data);
        });
}

function test2() {
    // test2 fonksiyonu için gerekli parametreler (username ve password) eksik.
    const username = "exampleUser"; // burada bir kullanıcı adı örneği veriyoruz
    const password = "examplePass"; // burada bir şifre örneği veriyoruz

    fetch("https://api.senyilma.com/test/OrnekVeriCekme/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken.getCSRFToken()
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
    });
}
