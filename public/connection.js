// Validation User
(function() {
    const currentPage = window.location.pathname.split('/').pop();
    

    const publicPages = ['login.html', 'register.html'];
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        if (publicPages.includes(currentPage)) {
            console.log('Sudah login, mengarahkan ke index.html...');
            window.location.href = 'index.html';
        }
    } else {
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
      e.preventDefault();
      
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

            localStorage.setItem('authToken', data.token);

            loginMessage.style.color = 'green';
            loginMessage.textContent = 'Login berhasil! Anda akan diarahkan...';
            
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

if (logoutButton) {
    logoutButton.addEventListener('click', (event) => {
        event.preventDefault(); 

        localStorage.removeItem('authToken');

        alert('Anda telah berhasil logout.');

        window.location.href = 'login.html'; 
    });
}