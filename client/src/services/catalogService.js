// Catalog data access. Reads from Firestore when configured, otherwise falls
// back to the bundled mock catalog so the storefront is fully functional in
// demo mode. All functions return Promises to keep the React Query interface
// identical across modes.
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { products as mockProducts } from '@/data/products';
import { categories as mockCategories } from '@/data/categories';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchProducts(filters = {}) {
  if (!isFirebaseConfigured) {
    await delay(150);
    return applyFilters(mockProducts, filters);
  }
  const snap = await getDocs(collection(db, 'products'));
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return applyFilters(list, filters);
}

export async function fetchProductBySlug(slug) {
  if (!isFirebaseConfigured) {
    await delay(120);
    return mockProducts.find((p) => p.slug === slug) || null;
  }
  const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function fetchCategories() {
  if (!isFirebaseConfigured) {
    await delay(80);
    return mockCategories;
  }
  const snap = await getDocs(collection(db, 'categories'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchRelated(product, max = 4) {
  const all = await fetchProducts({ category: product.category });
  return all.filter((p) => p.id !== product.id).slice(0, max);
}

// --- client-side filtering / sorting (mirrors server-side Firestore queries) ---
function applyFilters(list, filters) {
  let out = [...list];
  const { q, category, minPrice, maxPrice, brands, minRating, inStock, sort } = filters;

  if (q) {
    const needle = q.toLowerCase();
    out = out.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.brand.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle)
    );
  }
  if (category) out = out.filter((p) => p.category === category);
  if (minPrice != null) out = out.filter((p) => p.price >= minPrice);
  if (maxPrice != null) out = out.filter((p) => p.price <= maxPrice);
  if (brands?.length) out = out.filter((p) => brands.includes(p.brand));
  if (minRating) out = out.filter((p) => p.rating >= minRating);
  if (inStock) out = out.filter((p) => p.stock > 0);

  switch (sort) {
    case 'price-asc':
      out.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      out.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      out.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      out.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
      break;
    default:
      break;
  }
  return out;
}
