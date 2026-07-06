import { categories } from '@/data/categories';
import { formatPrice } from '@/lib/format';

const BRANDS = [
  'Classmate', 'Navneet', 'DOMS', 'Apsara', 'Nataraj', 'Cello', 'Reynolds', 'Linc',
  'Pilot', 'Uniball', 'Camlin', 'Camel', 'Faber-Castell', 'Fevicryl', 'Fevicol',
  'Kangaro', 'Oddy', 'Solo', 'Worldone', 'Local',
];

export default function FilterSidebar({ filters, setFilters, onClose }) {
  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));

  const toggleBrand = (brand) => {
    const set = new Set(filters.brands || []);
    set.has(brand) ? set.delete(brand) : set.add(brand);
    update({ brands: [...set] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Filters</h3>
        <button
          onClick={() => setFilters({})}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Clear all
        </button>
      </div>

      <FilterGroup title="Category">
        <select
          value={filters.category || ''}
          onChange={(e) => update({ category: e.target.value || undefined })}
          className="input"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup title="Max Price">
        <input
          type="range"
          min={0}
          max={2500}
          step={50}
          value={filters.maxPrice ?? 2500}
          onChange={(e) => update({ maxPrice: Number(e.target.value) })}
          className="w-full accent-primary"
        />
        <p className="mt-1 text-sm text-gray-500">Up to {formatPrice(filters.maxPrice ?? 2500)}</p>
      </FilterGroup>

      <FilterGroup title="Brand">
        <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
          {BRANDS.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.brands?.includes(b) || false}
                onChange={() => toggleBrand(b)}
                className="h-4 w-4 rounded accent-primary"
              />
              {b}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Rating">
        {[4, 3, 2].map((r) => (
          <label key={r} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === r}
              onChange={() => update({ minRating: r })}
              className="accent-primary"
            />
            {r}★ & above
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={(e) => update({ inStock: e.target.checked })}
            className="h-4 w-4 rounded accent-primary"
          />
          In stock only
        </label>
      </FilterGroup>

      {onClose && (
        <button onClick={onClose} className="btn-primary w-full lg:hidden">
          Apply filters
        </button>
      )}
    </div>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{title}</p>
      {children}
    </div>
  );
}
