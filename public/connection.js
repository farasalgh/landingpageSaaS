// Validation User
(function() {
    // Ambil path halaman saat ini
    const currentPage = window.location.pathname.split('/').pop();
    
    // Halaman yang tidak memerlukan login (halaman publik)
    const publicPages = ['login.html', 'register.html']; // Tambahkan halaman lain jika perlu

    // Cek apakah token ada di localStorage
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        // --- PENGGUNA SUDAH LOGIN ---
        
        // Jika pengguna sudah login tapi mencoba mengakses halaman login/register,
        // arahkan mereka ke halaman utama.
        if (publicPages.includes(currentPage)) {
            console.log('Sudah login, mengarahkan ke index.html...');
            window.location.href = 'index.html';
        }
    } else {
        // --- PENGGUNA BELUM LOGIN ---
        
        // Jika pengguna belum login dan mencoba mengakses halaman yang bukan publik,
        // paksa mereka ke halaman login.
        if (!publicPages.includes(currentPage)) {
            console.log('Belum login, mengarahkan ke login.html...');
            window.location.href = 'login.html';
        }
    }
})();

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const registerMessage = document.getElementById('registerMessage');
  const loginMessage = document.getElementById('loginMessage');

  const API_URL = 'http://localhost:3000/api/users'; // URL base backend Anda

  // Event listener untuk form registrasi
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Mencegah form dari reload halaman
      
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;

      try {
        const response = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Gagal mendaftar');
        }

        registerMessage.style.color = 'green';
        registerMessage.textContent = 'Registrasi berhasil! Silakan login.';
        registerForm.reset();

      } catch (error) {
        registerMessage.style.color = 'red';
        registerMessage.textContent = error.message;
      }
    });
  }

  // Event listener untuk form login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal login');
            }

            // Simpan token ke localStorage untuk digunakan nanti
            localStorage.setItem('authToken', data.token);

            loginMessage.style.color = 'green';
            loginMessage.textContent = 'Login berhasil! Anda akan diarahkan...';
            
            // Contoh: Arahkan ke halaman dashboard setelah berhasil login
             window.location.href = 'index.html';

        } catch (error) {
            loginMessage.style.color = 'red';
            loginMessage.textContent = error.message;
        }
    });
  }
});

// Logout
const logoutButton = document.getElementById('logout-button');

// Pastikan tombolnya ada sebelum menambahkan event listener
if (logoutButton) {
    logoutButton.addEventListener('click', (event) => {
        // Mencegah link berpindah halaman secara default
        event.preventDefault(); 

        // 1. Hapus token dari localStorage
        localStorage.removeItem('authToken');

        // 2. Beri pesan konfirmasi (opsional, tapi bagus untuk UX)
        alert('Anda telah berhasil logout.');

        // 3. Arahkan pengguna kembali ke halaman login
        window.location.href = 'login.html'; 
    });
}