import React, { useState } from 'react';
import { Maximize2, Tag } from 'lucide-react';
import { GalleryItem } from '../../types';
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from '../../data/galleryData';
import { Lightbox } from './Lightbox';

interface GalleryGridProps {
  initialCategory?: string;
  limit?: number;
  showFilters?: boolean;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  initialCategory = 'all',
  limit,
  showFilters = true,
}) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const displayedItems = limit ? filteredItems.slice(0, limit) : filteredItems;

  const handleNavigate = (newIndex: number) => {
    if (displayedItems[newIndex]) {
      setSelectedItem(displayedItems[newIndex]);
    }
  };

  return (
    <div>
      {/* Category Filter Pills */}
      {showFilters && (
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-sans uppercase tracking-widest rounded-full transition-all duration-300 focus:outline-none cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-forest-900 text-ivory font-semibold shadow-soft'
                  : 'bg-white/80 hover:bg-white text-forest-700 border border-forest-900/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Editorial Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative cursor-pointer overflow-hidden rounded-sm bg-cream-200 border border-forest-900/10 shadow-soft hover:shadow-card transition-all duration-500"
          >
            {/* Image */}
            <div className="aspect-[4/5] w-full overflow-hidden bg-forest-950">
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-ivory">
              {item.tag && (
                <div className="inline-flex items-center gap-1 text-[10px] font-sans uppercase tracking-widest text-gold-300 mb-1">
                  <Tag size={10} />
                  <span>{item.tag}</span>
                </div>
              )}
              <h3 className="font-serif text-lg font-medium leading-snug text-white">
                {item.title}
              </h3>
              <p className="text-[11px] text-ivory-300 line-clamp-2 mt-1">
                {item.description}
              </p>

              <div className="mt-3 flex items-center justify-between text-xs text-gold-300 font-sans tracking-wider uppercase pt-2 border-t border-ivory/20">
                <span>View Details</span>
                <Maximize2 size={13} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Accessible Lightbox Modal */}
      <Lightbox
        item={selectedItem}
        items={displayedItems}
        onClose={() => setSelectedItem(null)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};
