import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import Seo from '@/components/common/Seo';
import { fetchProducts } from '@/services/catalogService';
import { formatPrice } from '@/lib/format';
import { categories } from '@/data/categories';

export default function AdminProducts() {
  const { data: products = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: () => fetchProducts() });
  const [q, setQ] = useState('');

  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  const categoryName = (id) => categories.find((c) => c.id === id)?.name || id;

  return (
    <div>
      <Seo title="Manage Products" />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-bold">Products ({products.length})</h1>
        <button onClick={() => toast('Product editor opens here (wired to Firestore + Storage).')} className="btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="input pl-10" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-400">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        <span className="line-clamp-1 font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{categoryName(p.category)}</td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${p.stock < 30 ? 'bg-secondary-100 text-secondary-600' : 'bg-accent-100 text-accent-600'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => toast('Edit product')} className="rounded-lg p-2 hover:bg-gray-100"><Pencil size={16} /></button>
                        <button onClick={() => toast.error('Delete product')} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
