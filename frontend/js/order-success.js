// Renders the confirmation page after a successful order.

document.addEventListener('DOMContentLoaded', async () => {
  const id = new URLSearchParams(window.location.search).get('id');
  const container = document.getElementById('orderSuccessContainer');

  if (!id) {
    container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>No order found.</p></div>`;
    return;
  }

  try {
    const order = await api.get(`/orders/${id}`, true);

    container.innerHTML = `
      <div class="text-center mb-4">
        <i class="fa-solid fa-circle-check text-success" style="font-size:4rem;"></i>
        <h2 class="fw-bold mt-3">Order Placed Successfully!</h2>
        <p class="text-muted">Thank you, ${order.shippingAddress.fullName}. Your order has been received.</p>
        <p class="fw-semibold">Order ID: <span class="text-brand">#${order._id}</span></p>
      </div>

      <div class="row justify-content-center">
        <div class="col-lg-7">
          <div class="summary-box mb-3">
            <h6 class="fw-bold mb-3">Order Summary</h6>
            ${order.items.map((item) => `
              <div class="d-flex justify-content-between small mb-2">
                <span>${item.name} x${item.quantity}</span>
                <span>₹${item.price * item.quantity}</span>
              </div>
            `).join('')}
            <hr>
            <div class="d-flex justify-content-between small mb-1"><span>Subtotal</span><span>₹${order.subtotal}</span></div>
            <div class="d-flex justify-content-between small mb-1"><span>Shipping</span><span>${order.shippingCharge === 0 ? 'FREE' : '₹' + order.shippingCharge}</span></div>
            <div class="d-flex justify-content-between fw-bold fs-5 mt-2"><span>Total</span><span>₹${order.totalAmount}</span></div>
          </div>
          <div class="summary-box">
            <h6 class="fw-bold mb-2">Shipping To</h6>
            <p class="mb-1">${order.shippingAddress.fullName} | ${order.shippingAddress.phone}</p>
            <p class="mb-1">${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
            <p class="mb-0 text-muted small">Payment Method: ${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment (Simulated)'}</p>
          </div>
        </div>
      </div>

      <div class="text-center mt-4">
        <a href="products.html" class="btn btn-outline-brand px-4 me-2">Continue Shopping</a>
        <a href="orders.html" class="btn btn-brand px-4">View My Orders</a>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>${err.message}</p></div>`;
  }
});
