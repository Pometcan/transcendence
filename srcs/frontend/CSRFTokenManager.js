const backendUrl = "https://api.senyilma.com/";

export default class CSRFTokenManager {
    constructor() {
        this.csrfToken = null;
        this.fetchCSRFToken();
        // Her 14 dakikada token yenileme
        setInterval(() => this.refreshToken(), 14 * 60 * 1000);
    }

    // CSRF Token'ını cookie'den al
    getCSRFToken() {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; csrftoken=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return null;
    }

    // Backend'den yeni bir CSRF token al
    async fetchCSRFToken() {
        try {
            const response = await fetch(`${backendUrl}/test/get-csrf-token/`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                this.csrfToken = data.csrfToken;
                console.log('CSRF Token başarıyla alındı:', this.csrfToken);
                // Backend, token'ı güvenli şekilde set etmeli. Biz sadece frontend'de kullanıyoruz
                // Eğer backend, token'ı HttpOnly olarak set ediyorsa, burada ek bir işlem yapmamıza gerek yok.
                document.cookie = `csrftoken=${this.csrfToken}; path=/; secure`;
            } else {
                console.error('CSRF token isteği başarısız!');
            }
        } catch (error) {
            console.error('CSRF token alırken hata oluştu:', error);
        }
    }

    // Token yenileme işlemi
    async refreshToken() {
        try {
            const response = await fetch(`${backendUrl}/test/refresh/`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access', data.access);
                console.log('Token yenilendi:', data.access);
            } else {
                console.error('Refresh token başarısız!');
                this.handleTokenError();
            }
        } catch (error) {
            console.error('Token yenileme işlemi sırasında hata oluştu:', error);
            this.handleTokenError();
        }
    }

    // CSRF token'ı döndür
    getToken() {
        if (!this.csrfToken) {
            this.csrfToken = this.getCSRFToken();
        }
        return this.csrfToken;
    }

    // Token yenileme veya oturum hatası durumunda yapılacak işlemler
    handleTokenError() {
        // Token başarısız olduğunda localStorage'dan erişim token'ını temizle
        localStorage.removeItem('access');
        // Kullanıcıyı login sayfasına yönlendir
        window.location.href = 'frontend_static/login.html';
    }
}
