
import React from 'react';
import { FoodItem, Canteen, FoodCategory } from '@/services/api';
import FoodCard from './FoodCard';

interface FoodListProps {
  foodItems: FoodItem[];
  canteens: Canteen[];
  categories: FoodCategory[];
}

const FoodList: React.FC<FoodListProps> = ({ foodItems, canteens, categories }) => {
  const getCanteenName = (canteenId: string) => {
    const canteen = canteens.find((c) => c.id === canteenId);
    return canteen ? canteen.name : 'Unknown Canteen';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const groupedByCategory = foodItems.reduce((acc, item) => {
    const categoryName = getCategoryName(item.categoryId);
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, FoodItem[]>);

  return (
    <div className="space-y-12">
      {Object.entries(groupedByCategory).map(([category, items]) => (
        <div key={category} className="space-y-6">
          <h2 className="text-2xl font-bold border-b border-canteen-orange/30 pb-2">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <FoodCard 
                key={item.id} 
                foodItem={item} 
                canteenName={getCanteenName(item.canteenId)} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodList;
