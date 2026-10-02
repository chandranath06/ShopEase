// Logic for product-details.html

function getProductIdFromUrl() {
  return new URLSearchParams(window.location.search).get('id');
}

function renderProductDetails(product) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;
  const outOfStock = product.stock <= 0;

  document.getElementById('productDetailsContainer').innerHTML = `
    <div class="row g-5">
      <div class="col-md-6">
        <img src="${product.image}" class="img-fluid rounded-4 shadow-sm w-100" style="max-height:480px; object-fit:cover;" alt="${product.name}">
      </div>
      <div class="col-md-6">
        <span class="badge bg-secondary mb-2">${product.category}</span>
        <h2 class="fw-bold">${product.name}</h2>
        <div class="mb-2">${renderStars(product.rating)}</div>
        <div class="mb-3">
          <span class="price-current fs-3">₹${displayPrice}</span>
          ${hasDiscount ? `<span class="price-original fs-5">₹${product.price}</span>` : ''}
        </div>
        <p class="text-muted">${product.description}</p>
        <p class="fw-semibold ${outOfStock ? 'text-danger' : 'text-success'}">
          <i class="fa-solid ${outOfStock ? 'fa-circle-xmark' : 'fa-circle-check'}"></i>
          ${outOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
        </p>

        ${!outOfStock ? `
        <div class="d-flex align-items-center gap-3 my-3">
          <label class="fw-semibold mb-0">Quantity:</label>
          <div class="qty-control">
            <button onclick="changeQty(-1)">−</button>
            <span id="qtySelector" class="px-3">1</span>
            <button onclick="changeQty(1)">+</button>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-brand px-4" onclick="addToCartFromDetails()"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
          <button class="btn btn-brand px-4" onclick="buyNow()"><i class="fa-solid fa-bolt"></i> Buy Now</button>
        </div>
        ` : `<button class="btn btn-secondary px-4" disabled>Currently Unavailable</button>`}
      </div>
    </div>
  `;
}

let selectedQty = 1;
let currentProduct = null;

function changeQty(delta) {
  const max = currentProduct.stock;
  selectedQty = Math.min(Math.max(1, selectedQty + delta), max);
  document.getElementById('qtySelector').textContent = selectedQty;
}

function addToCartFromDetails() {
  Cart.addItem(currentProduct, selectedQty);
  showToast(`${currentProduct.name} added to cart!`);
}

function buyNow() {
  Cart.addItem(currentProduct, selectedQty);
  window.location.href = 'cart.html';
}

document.addEventListener('DOMContentLoaded', async () => {
  const id = getProductIdFromUrl();
  if (!id) {
    document.getElementById('productDetailsContainer').innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>No product specified.</p></div>`;
    return;
  }

  try {
    const data = await api.get(`/products/${id}`);
    currentProduct = data.product;
    renderProductDetails(data.product);

    const relatedContainer = document.getElementById('relatedProducts');
    relatedContainer.innerHTML = data.relatedProducts.length
      ? data.relatedProducts.map(productCardHTML).join('')
      : `<p class="text-muted">No related products found.</p>`;
  } catch (err) {
    document.getElementById('productDetailsContainer').innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>${err.message}</p></div>`;
  }
});
