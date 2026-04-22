import { useState } from 'react';
import { Star } from 'lucide-react';

export default function HalfStars({ value = 0, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(null);
  const display = hovered ?? value;
  const w = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  const half = size === 'sm' ? 8 : 12;

  return (
    <div className="flex gap-0.5" onMouseLeave={() => setHovered(null)}>
      {[1, 2, 3, 4, 5].map(star => {
        const halfVal = star * 2 - 1;
        const fullVal = star * 2;
        const isFull = display >= fullVal;
        const isHalf = !isFull && display >= halfVal;

        return (
          <div key={star} className="relative cursor-pointer" style={{ width: half * 2, height: half * 2 }}>
            <Star className={`absolute inset-0 ${w} text-white/15`} />
            {isFull && <Star className={`absolute inset-0 ${w} text-yellow-400 fill-yellow-400`} />}
            {isHalf && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: half }}>
                <Star className={`${w} text-yellow-400 fill-yellow-400`} />
              </div>
            )}
            <div
              className="absolute top-0 left-0 h-full z-10"
              style={{ width: half }}
              onMouseEnter={() => setHovered(halfVal)}
              onClick={() => onChange(value === halfVal ? 0 : halfVal)}
            />
            <div
              className="absolute top-0 right-0 h-full z-10"
              style={{ width: half }}
              onMouseEnter={() => setHovered(fullVal)}
              onClick={() => onChange(value === fullVal ? halfVal : fullVal)}
            />
          </div>
        );
      })}
    </div>
  );
}