// Storefront categories (stationery & xerox shop). In production these come
// from Firestore `categories`. `id` is used as the product.category key AND the
// URL slug, so they must match.
export const categories = [
  { id: 'pens', name: 'Pens', slug: 'pens', icon: '🖊️', color: 'bg-primary-50', image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80' },
  { id: 'notebooks', name: 'Notebooks', slug: 'notebooks', icon: '📓', color: 'bg-secondary-50', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80' },
  { id: 'pencils', name: 'Pencils & Erasers', slug: 'pencils', icon: '✏️', color: 'bg-accent-50', image: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=600&q=80' },
  { id: 'chart-paper', name: 'Chart Paper & Sheets', slug: 'chart-paper', icon: '📄', color: 'bg-primary-50', image: 'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=600&q=80' },
  { id: 'art-craft', name: 'Art & Craft', slug: 'art-craft', icon: '🎨', color: 'bg-secondary-50', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80' },
  { id: 'files-folders', name: 'Files & Folders', slug: 'files-folders', icon: '🗂️', color: 'bg-accent-50', image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600&q=80' },
  { id: 'office', name: 'Office Supplies', slug: 'office', icon: '📎', color: 'bg-primary-50', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80' },
  { id: 'wrapping', name: 'Wrapping & Stickers', slug: 'wrapping', icon: '🎀', color: 'bg-secondary-50', image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80' },
];
