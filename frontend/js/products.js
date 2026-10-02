// Logic for products.html: reads filters from the URL + filter panel,
// calls the backend, and renders the grid + pagination.

let currentPage = 1;

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function populateCategoryDropdown() {
  const select = document.getElementById('filterCategory');
  CATEGORIES.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

async function loadProducts(page = 1) {
  currentPage = page;
  const grid = document.getElementById('productGrid');
  grid.innerHTML = `<div class="loading-spinner-wrap w-100"><div class="spinner-border text-warning"></div></div>`;

  const search = document.getElementById('navSearchInput').value.trim();
  const category = document.getElementById('filterCategory').value;
  const minPrice = document.getElementById('filterMinPrice').value;
  const maxPrice = document.getElementById('filterMaxPrice').value;
  const sort = document.getElementById('filterSort').value;

  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category && category !== 'All') params.set('category', category);
  if (minPrice) params.set('minPrice', minPrice);
  if (maxPrice) params.set('maxPrice', maxPrice);
  if (sort) params.set('sort', sort);
  params.set('page', page);
  params.set('limit', 9);

  try {
    const data = await api.get(`/products?${params.toString()}`);
    document.getElementById('resultsCount').textContent = `${data.totalProducts} product(s) found`;

    if (data.products.length === 0) {
      grid.innerHTML = `<div class="empty-state w-100"><i class="fa-solid fa-magnifying-glass"></i><p>No products match your filters. Try adjusting your search.</p></div>`;
      document.getElementById('pagination').innerHTML = '';
      return;
    }

    grid.innerHTML = data.products.map(productCardHTML).join('');
    renderPagination(data.page, data.totalPages);
  } catch (err) {
    grid.innerHTML = `<div class="empty-state w-100"><i class="fa-solid fa-triangle-exclamation"></i><p>${err.message}</p></div>`;
  }
}

function renderPagination(page, totalPages) {
  const pag = document.getElementById('pagination');
  if (totalPages <= 1) { pag.innerHTML = ''; return; }

  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item ${i === page ? 'active' : ''}">
      <a class="page-link" href="#" onclick="loadProducts(${i}); return false;">${i}</a>
    </li>`;
  }
  pag.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  populateCategoryDropdown();
  renderCategoryPills('categoryPillsProducts', getQueryParam('category') || 'All');

  // Pre-fill filters from URL (e.g. coming from a category pill or navbar search)
  const urlSearch = getQueryParam('search');
  const urlCategory = getQueryParam('category');
  if (urlSearch) document.getElementById('navSearchInput').value = urlSearch;
  if (urlCategory) document.getElementById('filterCategory').value = urlCategory;

  document.getElementById('navSearchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    loadProducts(1);
  });
  document.getElementById('applyFiltersBtn').addEventListener('click', () => loadProducts(1));
  document.getElementById('clearFiltersBtn').addEventListener('click', () => {
    document.getElementById('filterCategory').value = 'All';
    document.getElementById('filterMinPrice').value = '';
    document.getElementById('filterMaxPrice').value = '';
    document.getElementById('filterSort').value = '';
    document.getElementById('navSearchInput').value = '';
    loadProducts(1);
  });

  loadProducts(1);
});
