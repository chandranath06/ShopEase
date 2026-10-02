// Handles client-side validation, password strength meter, and registration.

function checkPasswordStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const fill = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  const levels = [
    { width: '20%', color: '#dc2626', text: 'Very weak' },
    { width: '40%', color: '#f97316', text: 'Weak' },
    { width: '60%', color: '#f59e0b', text: 'Fair' },
    { width: '80%', color: '#22c55e', text: 'Good' },
    { width: '100%', color: '#16a34a', text: 'Strong' }
  ];
  const level = levels[Math.min(score, 4)];
  fill.style.width = level.width;
  fill.style.backgroundColor = level.color;
  label.textContent = password ? level.text : 'Minimum 6 characters';
}

function showAlert(message, type = 'danger') {
  const alertBox = document.getElementById('registerAlert');
  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;
  alertBox.classList.remove('d-none');
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const passwordInput = document.getElementById('password');

  passwordInput.addEventListener('input', () => checkPasswordStrength(passwordInput.value));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    let valid = true;

    document.getElementById('name').classList.toggle('is-invalid', !name);
    document.getElementById('email').classList.toggle('is-invalid', !emailValid);
    document.getElementById('password').classList.toggle('is-invalid', password.length < 6);
    document.getElementById('confirmPassword').classList.toggle('is-invalid', password !== confirmPassword);

    if (!name || !emailValid || password.length < 6 || password !== confirmPassword) {
      showAlert('Please fix the highlighted fields before continuing.');
      return;
    }

    const btn = document.getElementById('registerBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Creating account...';

    try {
      const data = await api.post('/auth/register', { name, email, password });
      Auth.saveSession(data);
      showAlert('Registration successful! Redirecting...', 'success');
      setTimeout(() => (window.location.href = 'index.html'), 1000);
    } catch (err) {
      showAlert(err.message);
      btn.disabled = false;
      btn.innerHTML = 'Register';
    }
  });
});
