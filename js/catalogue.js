import { fetchBouquets } from './api.js';

export const appState = {
  page: 1,
  limit: 4,
  category: 'all',
  query: '',
  total: 0,
  loading: false,
};

const bestsellersList = document.querySelector('[data-bestsellers-list]');
const catalogueList = document.querySelector('[data-catalogue-list]');
const loadMoreButton = document.querySelector('[data-load-more]');
const statusMessage = document.querySelector('[data-catalogue-status]');
const filterSelect = document.querySelector('[data-category-filter]');
const searchForm = document.querySelector('[data-search-form]');
const searchInput = document.querySelector('[data-search-input]');

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const cardMarkup = (item) => `
  <li class="product-card" data-product-id="${item.id}">
    <img src="${escapeHtml(item.image1x)}" srcset="${escapeHtml(item.image1x)} 1x, ${escapeHtml(item.image2x)} 2x" width="400" height="320" loading="lazy" alt="${escapeHtml(item.alt)}">
    <div class="product-content">
      <h3 class="product-title">${escapeHtml(item.title)}</h3>
      <p class="price">$${Number(item.price).toFixed(0)}</p>
      <p class="product-description">${escapeHtml(item.description)}</p>
      <button class="text-button js-open-modal" type="button" data-bouquet-name="${escapeHtml(item.title)}">Order bouquet</button>
    </div>
  </li>`;

const setStatus = (message, type = 'info') => {
  statusMessage.textContent = message;
  statusMessage.dataset.type = type;
  statusMessage.hidden = !message;
};

const updateLoadMore = () => {
  const loaded = catalogueList.children.length;
  const hasMore = loaded < appState.total;
  loadMoreButton.hidden = !hasMore || appState.total === 0;
  if (!hasMore && appState.total > 0) setStatus(`All ${appState.total} bouquets are loaded.`);
};

export async function loadBestsellers() {
  bestsellersList.setAttribute('aria-busy', 'true');
  try {
    const { items } = await fetchBouquets({ page: 1, limit: 3, featured: true });
    bestsellersList.insertAdjacentHTML('beforeend', items.map(cardMarkup).join(''));
  } catch (error) {
    bestsellersList.insertAdjacentHTML('beforeend', '<li class="request-message error-message">Bestsellers could not be loaded.</li>');
  } finally {
    bestsellersList.setAttribute('aria-busy', 'false');
  }
}

export async function loadCatalogue({ reset = false } = {}) {
  if (appState.loading) return;
  appState.loading = true;
  loadMoreButton.disabled = true;
  loadMoreButton.textContent = 'Loading…';
  setStatus(reset ? 'Loading bouquets…' : 'Loading more bouquets…');

  if (reset) {
    appState.page = 1;
    appState.total = 0;
    catalogueList.replaceChildren();
  }

  try {
    const { items, total } = await fetchBouquets(appState);
    appState.total = total;
    if (items.length) {
      catalogueList.insertAdjacentHTML('beforeend', items.map(cardMarkup).join(''));
      setStatus('');
    } else if (reset) {
      setStatus('No bouquets match your search. Try another filter.', 'empty');
    }
    updateLoadMore();
  } catch (error) {
    setStatus(error.message, 'error');
    loadMoreButton.hidden = true;
  } finally {
    appState.loading = false;
    loadMoreButton.disabled = false;
    loadMoreButton.textContent = 'Load more';
  }
}

loadMoreButton.addEventListener('click', () => {
  appState.page += 1;
  loadCatalogue();
});

filterSelect.addEventListener('change', () => {
  appState.category = filterSelect.value;
  loadCatalogue({ reset: true });
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  appState.query = searchInput.value;
  loadCatalogue({ reset: true });
});

