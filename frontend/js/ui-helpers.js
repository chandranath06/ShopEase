// Shared UI helpers used across multiple pages: toasts, star ratings,
// product card markup, and the category list used on both home + products page.

const CATEGORIES = ['Electronics', 'Fashion', 'Shoes', 'Beauty', 'Home & Kitchen', 'Accessories', 'Sports', 'Books'];

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) { alert(message); return; }

  const bg = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-secondary';
  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-white ${bg} border-0`;
  toastEl.setAttribute('role', 'alert');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
  container.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

function renderStars(rating) {
  const full = Math.round(rating);
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<i class="fa-${i <= full ? 'solid' : 'regular'} fa-star"></i>`;
  }
  return `<span class="rating-stars">${html}</span> <span class="small text-muted">(${rating.toFixed(1)})</span>`;
}

function productCardHTML(product) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;
  const outOfStock = product.stock <= 0;

  return `
  <div class="col-lg-3 col-md-4 col-6">
    <div class="card product-card position-relative">
      ${hasDiscount ? `<span class="badge badge-discount position-absolute m-2">-${Math.round(100 - (product.discountPrice / product.price) * 100)}%</span>` : ''}
      ${outOfStock ? `<span class="badge badge-stock-out position-absolute m-2 top-0 end-0">Out of Stock</span>` : ''}
      <a href="product-details.html?id=${product._id}">
        <img src="${product.image}" alt="${product.name}">
      </a>
      <div class="card-body p-3">
        <span class="small text-muted">${product.category}</span>
        <h6 class="mt-1 mb-1"><a href="product-details.html?id=${product._id}" class="text-dark">${product.name}</a></h6>
        <div class="mb-1">${renderStars(product.rating)}</div>
        <div class="mb-2">
          <span class="price-current">₹${displayPrice}</span>
          ${hasDiscount ? `<span class="price-original">₹${product.price}</span>` : ''}
        </div>
        <button class="btn btn-brand btn-sm w-100 mt-auto" ${outOfStock ? 'disabled' : ''}
          onclick='quickAddToCart(${JSON.stringify(product).replace(/'/g, "&apos;")})'>
          <i class="fa-solid fa-cart-plus"></i> ${outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  </div>`;
}

function quickAddToCart(product) {
  Cart.addItem(product, 1);
  showToast(`${product.name} added to cart!`);
}

function renderCategoryPills(containerId, activeCategory = 'All') {
  const container = document.getElementById(containerId);
  if (!container) return;
  const all = ['All', ...CATEGORIES];
  container.innerHTML = all.map((cat) => `
    <a href="products.html?category=${encodeURIComponent(cat)}" class="category-pill ${cat === activeCategory ? 'active' : ''}">${cat}</a>
  `).join('');
}
