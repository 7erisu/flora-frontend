import axios from 'axios';

const remoteBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');

const api = axios.create({
  baseURL: remoteBaseUrl || '/api',
  timeout: 7000,
});

let staticCache = null;

const filterStaticData = (items, { page, limit, category, query, featured }) => {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = items.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    const matchesQuery = !normalizedQuery || `${item.title} ${item.description}`.toLowerCase().includes(normalizedQuery);
    const matchesFeatured = featured === undefined || item.featured === featured;
    return matchesCategory && matchesQuery && matchesFeatured;
  });
  const start = (page - 1) * limit;
  return { items: filtered.slice(start, start + limit), total: filtered.length };
};

const normalizeBouquet = (item) => ({
  ...item,
  image1x: item.image1x || item.photoURL,
  image2x: item.image2x || item.photoURL,
  alt: item.alt || `${item.title} bouquet`,
});

export async function fetchBouquets({ page = 1, limit = 4, category = 'all', query = '', featured } = {}) {
  if (import.meta.env.PROD && !remoteBaseUrl) {
    if (!staticCache) {
      const response = await axios.get(`${import.meta.env.BASE_URL}db.json`, { timeout: 7000 });
      staticCache = response.data.bouquets;
    }
    const result = filterStaticData(staticCache, { page, limit, category, query, featured });
    return { ...result, items: result.items.map(normalizeBouquet) };
  }

  const params = remoteBaseUrl ? { page, limit } : { _page: page, _limit: limit };
  if (category !== 'all') params.category = category;
  if (query.trim()) params.q = query.trim();
  if (featured !== undefined && !remoteBaseUrl) params.featured = featured;

  try {
    const response = await api.get('/bouquets', { params });
    const items = Array.isArray(response.data) ? response.data : response.data.data;
    const total = Number(response.headers['x-total-count'] ?? response.data.meta?.total ?? items.length);
    return { items: items.map(normalizeBouquet), total };
  } catch (serverError) {
    try {
      if (!staticCache) {
        const response = await axios.get(`${import.meta.env.BASE_URL}db.json`, { timeout: 7000 });
        staticCache = response.data.bouquets;
      }
      const result = filterStaticData(staticCache, { page, limit, category, query, featured });
      return { ...result, items: result.items.map(normalizeBouquet) };
    } catch (fallbackError) {
      throw new Error('Unable to load bouquets. Please start the mock API and try again.', { cause: serverError });
    }
  }
}
