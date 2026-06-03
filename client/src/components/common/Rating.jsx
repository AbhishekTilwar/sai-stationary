import { Star } from 'lucide-react';

export default function Rating({ value = 0, count, size = 14 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i < full || (i === full && half);
          return (
            <Star
              key={i}
              size={size}
              className={filled ? 'fill-secondary text-secondary' : 'text-gray-300'}
            />
          );
        })}
      </div>
      {count != null && <span className="text-xs text-gray-400">({count})</span>}
    </div>
  );
}
