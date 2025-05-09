
import React from 'react';
import { FoodCategory } from '@/services/api';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  categories: FoodCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Categories</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex p-4 gap-4">
          <button
            key="all"
            className={cn(
              "flex-shrink-0 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
              selectedCategory === null
                ? "bg-canteen-orange text-white hover:bg-canteen-orange/90"
                : "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => onSelectCategory(null)}
          >
            All
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              className={cn(
                "flex-shrink-0 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                selectedCategory === category.id
                  ? "bg-canteen-orange text-white hover:bg-canteen-orange/90"
                  : "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => onSelectCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CategorySelector;
