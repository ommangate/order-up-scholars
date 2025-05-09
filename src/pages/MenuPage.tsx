
import React, { useState, useEffect } from 'react';
import { fetchCanteens, fetchFoodCategories, fetchFoodItems, Canteen, FoodCategory, FoodItem } from '@/services/api';
import CanteenSelector from '@/components/Menu/CanteenSelector';
import CategorySelector from '@/components/Menu/CategorySelector';
import FoodList from '@/components/Menu/FoodList';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const MenuPage: React.FC = () => {
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedCanteen, setSelectedCanteen] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [canteenData, categoryData] = await Promise.all([
          fetchCanteens(),
          fetchFoodCategories(),
        ]);
        
        setCanteens(canteenData);
        setCategories(categoryData);
        
        if (canteenData.length > 0) {
          setSelectedCanteen(canteenData[0].id);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    
    fetchInitialData();
  }, []);
  
  useEffect(() => {
    const fetchFoodData = async () => {
      setLoading(true);
      try {
        const items = await fetchFoodItems(selectedCanteen, selectedCategory);
        setFoodItems(items.filter(item => item.available));
      } catch (error) {
        console.error('Error fetching food items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (selectedCanteen) {
      fetchFoodData();
    }
  }, [selectedCanteen, selectedCategory]);
  
  const filteredFoodItems = searchQuery.trim() 
    ? foodItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : foodItems;
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Food Menu</h1>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search for food items..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <CanteenSelector
        canteens={canteens}
        selectedCanteen={selectedCanteen}
        onSelectCanteen={setSelectedCanteen}
      />
      
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Loading menu items...</p>
        </div>
      ) : filteredFoodItems.length > 0 ? (
        <FoodList 
          foodItems={filteredFoodItems} 
          canteens={canteens}
          categories={categories}
        />
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">
            {searchQuery.trim() ? 
              'No items found matching your search. Try different keywords.' : 
              'No items available for selected canteen and category.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
