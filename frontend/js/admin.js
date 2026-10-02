// Admin dashboard: stats, product CRUD, order status updates, user management.

let productModal;

function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach((el) => el.classList.toggle('active', el.dataset.tab === tab));
  document.querySelectorAll('.admin-panel').forEach((el) => el.classList.add('d-none'));
  document.getElementById(`panel-${tab}`).classList.remove('d-none');

  if (tab === 'dashboard') loadDashboard();
  if (tab === 'products') loadProductsTable();
  if (tab === 'orders') loadOrdersTable();
  if (tab === 'users') loadUsersTable();
}

async function loadDashboard() {
  try {
    const stats = await api.get('/admin/dashboard', true);
    const cards = [
      { label: 'Total Users', value: stats.totalUsers, icon: 'fa-users', color: '#3b82f6' },
      { label: 'Total Products', value: stats.totalProducts, icon: 'fa-box', color: '#8b5cf6' },
      { label: 'Total Orders', value: stats.totalOrders, icon: 'fa-receipt', color: '#f59e0b' },
      { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: 'fa-indian-rupee-sign', color: '#22c55e' },
      { label: 'Pending Orders', value: stats.pendingOrders, icon: 'fa-hourglass-half', color: '#ef4444' },
      { label: 'Delivered Orders', value: stats.deliveredOrders, icon: 'fa-truck-fast', color: '#06b6d4' }
    ];
    document.getElementById('dashboardStats').innerHTML = cards.map((c) => `
      <div class="col-md-4">
        <div class="stat-card d-flex justify-content-between align-items-center" style="background:${c.color};">
          <div><p class="mb-1 small opacity-75">${c.label}</p><h3 class="fw-bold mb-0">${c.value}</h3></div>
          <i class="fa-solid ${c.icon}"></i>
        </div>
      </div>
    `).join('');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function loadProductsTable() {
  try {
    const data = await api.get('/products?limit=100');
    document.getElementById('productsTableBody').innerHTML = data.products.map((p) => `
      <tr>
        <td><img src="${p.image}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;"></td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>₹${p.discountPrice || p.price}</td>
        <td>${p.stock}</td>
        <td>${p.rating}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1" onclick='openProductModal(${JSON.stringify(p).replace(/'/g, "&apos;")})' data-bs-toggle="modal" data-bs-target="#productModal"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${p._id}')"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function openProductModal(product = null) {
  document.getElementById('productFormAlert').classList.add('d-none');
  document.getElementById('productForm').reset();
  document.getElementById('productModalTitle').textContent = product ? 'Edit Product' : 'Add Product';
  document.getElementById('pId').value = product ? product._id : '';
  if (product) {
    document.getElementById('pName').value = product.name;
    document.getElementById('pDescription').value = product.description;
    document.getElementById('pPrice').value = product.price;
    document.getElementById('pDiscountPrice').value = product.discountPrice || '';
    document.getElementById('pCategory').value = product.category;
    document.getElementById('pImage').value = product.image;
    document.getElementById('pStock').value = product.stock;
    document.getElementById('pRating').value = product.rating;
  }
}

async function saveProduct() {
  const id = document.getElementById('pId').value;
  const payload = {
    name: document.getElementById('pName').value.trim(),
    description: document.getElementById('pDescription').value.trim(),
    price: Number(document.getElementById('pPrice').value),
    discountPrice: document.getElementById('pDiscountPrice').value ? Number(document.getElementById('pDiscountPrice').value) : null,
    category: document.getElementById('pCategory').value,
    image: document.getElementById('pImage').value.trim(),
    stock: Number(document.getElementById('pStock').value),
    rating: document.getElementById('pRating').value ? Number(document.getElementById('pRating').value) : 4
  };

  if (!payload.name || !payload.description || !payload.price || !payload.category || !payload.image) {
    const alertBox = document.getElementById('productFormAlert');
    alertBox.textContent = 'Please fill all required fields.';
    alertBox.classList.remove('d-none');
    return;
  }

  try {
    if (id) {
      await api.put(`/products/${id}`, payload, true);
      showToast('Product updated successfully!');
    } else {
      await api.post('/products', payload, true);
      showToast('Product added successfully!');
    }
    bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
    loadProductsTable();
  } catch (err) {
    const alertBox = document.getElementById('productFormAlert');
    alertBox.textContent = err.message;
    alertBox.classList.remove('d-none');
  }
}

async function deleteProduct(id) {
  if (!confirm('Delete this product? This cannot be undone.')) return;
  try {
    await api.delete(`/products/${id}`, true);
    showToast('Product deleted.');
    loadProductsTable();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

async function loadOrdersTable() {
  try {
    const orders = await api.get('/admin/orders', true);
    document.getElementById('ordersTableBody').innerHTML = orders.map((o) => `
      <tr>
        <td class="small">#${o._id.slice(-8).toUpperCase()}</td>
        <td>${o.user ? o.user.name : 'N/A'}</td>
        <td class="small">${new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
        <td class="small">${o.items.length} item(s)</td>
        <td>₹${o.totalAmount}</td>
        <td><span class="badge status-${o.status}">${o.status}</span></td>
        <td>
          <select class="form-select form-select-sm" onchange="updateOrderStatus('${o._id}', this.value)">
            ${ORDER_STATUSES.map((s) => `<option value="${s}" ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    await api.put(`/admin/orders/${orderId}/status`, { status }, true);
    showToast('Order status updated.');
    loadOrdersTable();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function loadUsersTable() {
  try {
    const users = await api.get('/admin/users', true);
    document.getElementById('usersTableBody').innerHTML = users.map((u) => `
      <tr>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.phone || '-'}</td>
        <td><span class="badge ${u.role === 'admin' ? 'bg-dark' : 'bg-secondary'}">${u.role}</span></td>
        <td class="small">${new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
        <td>
          ${u.role !== 'admin' ? `<button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${u._id}')"><i class="fa-solid fa-trash"></i></button>` : '<span class="text-muted small">Protected</span>'}
        </td>
      </tr>
    `).join('');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteUser(id) {
  if (!confirm('Delete this user account? This cannot be undone.')) return;
  try {
    await api.delete(`/admin/users/${id}`, true);
    showToast('User deleted.');
    loadUsersTable();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!Auth.isLoggedIn() || !Auth.isAdmin()) {
    document.getElementById('adminGuardMessage').classList.remove('d-none');
    return;
  }
  document.getElementById('adminContent').classList.remove('d-none');

  // Populate category select in the product modal
  const catSelect = document.getElementById('pCategory');
  CATEGORIES.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    catSelect.appendChild(opt);
  });

  document.querySelectorAll('.admin-tab').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      switchAdminTab(el.dataset.tab);
    });
  });

  document.getElementById('saveProductBtn').addEventListener('click', saveProduct);

  loadDashboard();
});
