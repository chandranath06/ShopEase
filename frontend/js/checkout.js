// Handles checkout form validation, order summary rendering, and order placement.

function renderCheckoutSummary() {
  const cart = Cart.getCart();
  const totals = Cart.getTotals();

  document.getElementById('checkoutItemsList').innerHTML = cart.map((item) => `
    <div class="d-flex justify-content-between small mb-1">
      <span>${item.name} x${item.quantity}</span>
      <span>₹${item.price * item.quantity}</span>
    </div>
  `).join('');

  document.getElementById('ccSubtotal').textContent = `₹${totals.subtotal}`;
  document.getElementById('ccShipping').textContent = totals.shippingCharge === 0 ? 'FREE' : `₹${totals.shippingCharge}`;
  document.getElementById('ccTotal').textContent = `₹${totals.total}`;
}

function showCheckoutAlert(message) {
  const box = document.getElementById('checkoutAlert');
  box.textContent = message;
  box.classList.remove('d-none');
}

document.addEventListener('DOMContentLoaded', () => {
  // Guard: must be logged in and have items in the cart
  if (!Auth.isLoggedIn()) {
    window.location.href = 'login.html?redirect=checkout.html';
    return;
  }
  if (Cart.getCart().length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  renderCheckoutSummary();

  // Pre-fill known info
  const user = Auth.getUser();
  document.getElementById('fullName').value = user.name || '';
  document.getElementById('ccEmail').value = user.email || '';

  document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      document.getElementById('onlinePaymentBox').classList.toggle('d-none', radio.value !== 'ONLINE' || !radio.checked);
    });
  });

  document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('ccEmail').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const pincode = document.getElementById('pincode').value.trim();
    const street = document.getElementById('street').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    const phoneValid = /^[0-9]{10}$/.test(phone);
    const pincodeValid = /^[0-9]{6}$/.test(pincode);

    if (!fullName || !email || !phoneValid || !pincodeValid || !street || !city || !state) {
      showCheckoutAlert('Please fill all fields correctly. Phone must be 10 digits and PIN must be 6 digits.');
      return;
    }

    const cart = Cart.getCart();
    const items = cart.map((item) => ({ productId: item.productId, quantity: item.quantity }));

    const btn = document.getElementById('placeOrderBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Placing order...';

    try {
      const order = await api.post('/orders', {
        items,
        shippingAddress: { fullName, email, phone, street, city, state, pincode },
        paymentMethod
      }, true);

      Cart.clearCart();
      localStorage.setItem('shopease_last_order', JSON.stringify(order));
      window.location.href = `order-success.html?id=${order._id}`;
    } catch (err) {
      showCheckoutAlert(err.message);
      btn.disabled = false;
      btn.innerHTML = 'Place Order';
    }
  });
});
