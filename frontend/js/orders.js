// My Orders page: fetches the logged-in user's own order history.

function statusBadge(status) {
  return `<span class="badge status-${status}">${status}</span>`;
}

function renderOrders(orders) {
  const container = document.getElementById('ordersContainer');

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-box-open"></i>
        <p>You haven't placed any orders yet.</p>
        <a href="products.html" class="btn btn-brand">Start Shopping</a>
      </div>`;
    return;
  }

  container.innerHTML = orders.map((order) => `
    <div class="summary-box mb-3">
      <div class="d-flex justify-content-between flex-wrap mb-2">
        <div>
          <span class="fw-semibold">Order #${order._id.slice(-8).toUpperCase()}</span>
          <span class="text-muted small ms-2">${new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
        ${statusBadge(order.status)}
      </div>
      <hr class="my-2">
      ${order.items.map((item) => `
        <div class="d-flex justify-content-between small mb-1">
          <span>${item.name} x${item.quantity}</span>
          <span>₹${item.price * item.quantity}</span>
        </div>
      `).join('')}
      <hr class="my-2">
      <div class="d-flex justify-content-between">
        <span class="text-muted small">Payment: ${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
        <span class="fw-bold">Total: ₹${order.totalAmount}</span>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!Auth.isLoggedIn()) {
    window.location.href = 'login.html?redirect=orders.html';
    return;
  }

  try {
    const orders = await api.get('/orders/my-orders', true);
    renderOrders(orders);
  } catch (err) {
    document.getElementById('ordersContainer').innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>${err.message}</p></div>`;
  }
});
