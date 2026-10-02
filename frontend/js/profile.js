// Loads and updates the logged-in user's profile information.

function showProfileAlert(message, type = 'success') {
  const box = document.getElementById('profileAlert');
  box.className = `alert alert-${type}`;
  box.textContent = message;
  box.classList.remove('d-none');
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!Auth.isLoggedIn()) {
    window.location.href = 'login.html?redirect=profile.html';
    return;
  }

  try {
    const user = await api.get('/auth/profile', true);
    document.getElementById('profName').value = user.name || '';
    document.getElementById('profEmail').value = user.email || '';
    document.getElementById('profPhone').value = user.phone || '';
    document.getElementById('profStreet').value = user.address?.street || '';
    document.getElementById('profCity').value = user.address?.city || '';
    document.getElementById('profState').value = user.address?.state || '';
    document.getElementById('profPincode').value = user.address?.pincode || '';
  } catch (err) {
    showProfileAlert(err.message, 'danger');
  }

  document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const updated = await api.put('/auth/profile', {
        name: document.getElementById('profName').value.trim(),
        phone: document.getElementById('profPhone').value.trim(),
        address: {
          street: document.getElementById('profStreet').value.trim(),
          city: document.getElementById('profCity').value.trim(),
          state: document.getElementById('profState').value.trim(),
          pincode: document.getElementById('profPincode').value.trim()
        }
      }, true);

      // Keep the locally stored session name in sync with the update
      const session = Auth.getUser();
      session.name = updated.name;
      localStorage.setItem('shopease_user', JSON.stringify(session));

      showProfileAlert('Profile updated successfully!');
    } catch (err) {
      showProfileAlert(err.message, 'danger');
    }
  });
});
