// Logic specific to index.html: loads featured products + category pills.

document.addEventListener('DOMContentLoaded', async () => {
  renderCategoryPills('categoryPillsHome');
  const featuredContainer = document.getElementById('featuredProducts');

  try {
    const data = await api.get('/products?limit=8&sort=rating');
    if (data.products.length === 0) {
      featuredContainer.innerHTML = `<div class="empty-state w-100"><i class="fa-solid fa-box-open"></i><p>No products available yet.</p></div>`;
      return;
    }
    featuredContainer.innerHTML = data.products.map(productCardHTML).join('');
  } catch (err) {
    featuredContainer.innerHTML = `<div class="empty-state w-100"><i class="fa-solid fa-triangle-exclamation"></i><p>${err.message}</p></div>`;
  }
});
