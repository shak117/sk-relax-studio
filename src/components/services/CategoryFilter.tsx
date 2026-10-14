import React from 'react';
import { ServiceCategory } from '../../types';

interface CategoryFilterProps {
  categories: readonly { readonly id: string; readonly label: string }[];
  activeCategory: string;
  onSelectCategory: (id: ServiceCategory) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center justify-start md:justify-center gap-2 min-w-max px-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as ServiceCategory)}
              className={`px-4 py-2 text-xs font-sans uppercase tracking-widest rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 cursor-pointer ${
                isActive
                  ? 'bg-forest-900 text-ivory font-semibold shadow-soft border border-forest-800'
                  : 'bg-white/80 hover:bg-white text-forest-700 hover:text-forest-900 border border-forest-900/10'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
