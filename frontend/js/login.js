// Handles login form submission, error display, and post-login redirect.
// Supports an optional ?redirect=checkout.html style param so checkout can
// send unauthenticated users here and bring them right back afterward.

function showLoginAlert(message) {
  const alertBox = document.getElementById('loginAlert');
  alertBox.textContent = message;
  alertBox.classList.remove('d-none');
}

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, no need to show the login form again
  if (Auth.isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showLoginAlert('Please enter both email and password.');
      return;
    }

    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Logging in...';

    try {
      const data = await api.post('/auth/login', { email, password });
      Auth.saveSession(data);

      const redirect = new URLSearchParams(window.location.search).get('redirect');
      window.location.href = redirect || 'index.html';
    } catch (err) {
      showLoginAlert(err.message);
      btn.disabled = false;
      btn.innerHTML = 'Login';
    }
  });
});
