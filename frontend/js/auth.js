// Handles login state, registration, login and shared navbar behaviour.

const Auth = {
  getToken() {
    return localStorage.getItem('shopease_token');
  },
  getUser() {
    const raw = localStorage.getItem('shopease_user');
    return raw ? JSON.parse(raw) : null;
  },
  isLoggedIn() {
    return !!this.getToken();
  },
  isAdmin() {
    const user = this.getUser();
    return !!user && user.role === 'admin';
  },
  saveSession(data) {
    localStorage.setItem('shopease_token', data.token);
    localStorage.setItem(
      'shopease_user',
      JSON.stringify({ _id: data._id, name: data.name, email: data.email, role: data.role })
    );
  },
  logout() {
    localStorage.removeItem('shopease_token');
    localStorage.removeItem('shopease_user');
    window.location.href = 'index.html';
  }
};

// Renders login/profile state + cart count in the navbar on every page.
// Every page should have: <div id="navbarAuthSlot"></div> and <span id="cartCount"></span>
function renderNavbarAuthState() {
  const slot = document.getElementById('navbarAuthSlot');
  if (!slot) return;

  if (Auth.isLoggedIn()) {
    const user = Auth.getUser();
    slot.innerHTML = `
      <div class="dropdown">
        <a class="btn btn-outline-light dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
          <i class="fa-solid fa-user"></i> ${user.name.split(' ')[0]}
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="profile.html"><i class="fa-solid fa-id-card me-2"></i>My Profile</a></li>
          <li><a class="dropdown-item" href="orders.html"><i class="fa-solid fa-box me-2"></i>My Orders</a></li>
          ${user.role === 'admin' ? '<li><a class="dropdown-item" href="admin.html"><i class="fa-solid fa-gauge me-2"></i>Admin Dashboard</a></li>' : ''}
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" onclick="Auth.logout(); return false;"><i class="fa-solid fa-right-from-bracket me-2"></i>Logout</a></li>
        </ul>
      </div>
    `;
  } else {
    slot.innerHTML = `<a href="login.html" class="btn btn-outline-light"><i class="fa-solid fa-user"></i> Login / Register</a>`;
  }

  updateCartCountBadge();
}

function updateCartCountBadge() {
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  const cart = Cart.getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-block' : 'none';
}

document.addEventListener('DOMContentLoaded', renderNavbarAuthState);
