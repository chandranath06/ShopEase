// Renders cart items, handles quantity changes / removal, and the summary box.

function renderCartPage() {
  const cart = Cart.getCart();
  const container = document.getElementById('cartItemsContainer');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-cart-shopping"></i>
        <p>Your cart is empty.</p>
        <a href="products.html" class="btn btn-brand">Start Shopping</a>
      </div>`;
  } else {
    container.innerHTML = cart.map((item) => `
      <div class="cart-item-row d-flex align-items-center">
        <img src="${item.image}" style="width:80px;height:80px;object-fit:cover;border-radius:10px;" class="me-3" alt="${item.name}">
        <div class="flex-grow-1">
          <h6 class="mb-1">${item.name}</h6>
          <p class="mb-1 text-muted small">₹${item.price} each</p>
          <div class="qty-control">
            <button onclick="handleQtyChange('${item.productId}', ${item.quantity - 1})">−</button>
            <span class="px-3">${item.quantity}</span>
            <button onclick="handleQtyChange('${item.productId}', ${item.quantity + 1})">+</button>
          </div>
        </div>
        <div class="text-end">
          <p class="fw-bold mb-2">₹${item.price * item.quantity}</p>
          <button class="btn btn-sm btn-outline-danger" onclick="handleRemoveItem('${item.productId}')"><i class="fa-solid fa-trash"></i> Remove</button>
        </div>
      </div>
    `).join('');
  }

  const totals = Cart.getTotals();
  document.getElementById('summaryQty').textContent = totals.totalQuantity;
  document.getElementById('summarySubtotal').textContent = `₹${totals.subtotal}`;
  document.getElementById('summaryShipping').textContent = totals.shippingCharge === 0 ? 'FREE' : `₹${totals.shippingCharge}`;
  document.getElementById('summaryDiscount').textContent = `-₹${totals.discount}`;
  document.getElementById('summaryTotal').textContent = `₹${totals.total}`;

  document.getElementById('checkoutBtn').disabled = cart.length === 0;
}

function handleQtyChange(productId, newQty) {
  if (newQty < 1) {
    handleRemoveItem(productId);
    return;
  }
  Cart.updateQuantity(productId, newQty);
  renderCartPage();
}

function handleRemoveItem(productId) {
  Cart.removeItem(productId);
  renderCartPage();
  showToast('Item removed from cart.', 'info');
}

document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();

  document.getElementById('clearCartBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      Cart.clearCart();
      renderCartPage();
    }
  });

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (Cart.getCart().length === 0) return;
    if (!Auth.isLoggedIn()) {
      showToast('Please login to proceed to checkout.', 'info');
      window.location.href = 'login.html?redirect=checkout.html';
      return;
    }
    window.location.href = 'checkout.html';
  });
});
