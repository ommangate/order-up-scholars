
import React from 'react';
import { FoodItem } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Plus, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface FoodCardProps {
  foodItem: FoodItem;
  canteenName: string;
}

const FoodCard: React.FC<FoodCardProps> = ({ foodItem, canteenName }) => {
  const { addToCart, items } = useCart();
  const [customization, setCustomization] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Check if item is already in cart
  const inCart = items.some(item => item.foodItem.id === foodItem.id);
  const cartItem = items.find(item => item.foodItem.id === foodItem.id);
  
  const handleAddToCart = () => {
    if (customization.trim() !== '') {
      addToCart(foodItem, quantity, customization);
    } else {
      addToCart(foodItem, quantity);
    }
    setIsDialogOpen(false);
    setCustomization('');
    setQuantity(1);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (!foodItem.available) {
    return null; // Don't show unavailable items
  }
  
  return (
    <div className="food-card animate-fade-in overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
      <span className="food-badge absolute top-2 right-2 bg-opacity-90 bg-canteen-orange text-white text-xs px-2 py-1 rounded-full z-10">
        {canteenName}
      </span>
      <div 
        className="food-image h-40 w-full bg-gray-200 relative" 
      >
        <img 
          src={imageError ? '/placeholder.svg' : (foodItem.image || '/placeholder.svg')} 
          alt={foodItem.name}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <div className="food-content p-4">
        <h3 className="food-title text-lg font-semibold line-clamp-1">{foodItem.name}</h3>
        {foodItem.description && (
          <p className="food-description text-sm text-gray-600 mt-1 line-clamp-2">{foodItem.description}</p>
        )}
        <div className="flex justify-between items-center mt-3">
          <span className="food-price font-medium text-canteen-orange">₹{foodItem.price}</span>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-canteen-orange hover:text-white rounded-full h-8 w-8 p-0 flex items-center justify-center"
              >
                <Plus size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Customize Your Order</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid w-full items-center gap-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">{foodItem.name}</h4>
                      <p className="text-sm text-gray-500">₹{foodItem.price}</p>
                    </div>
                    <img 
                      src={imageError ? '/placeholder.svg' : (foodItem.image || '/placeholder.svg')} 
                      alt={foodItem.name}
                      className="h-12 w-12 rounded object-cover"
                      onError={handleImageError}
                    />
                  </div>
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="customization" className="text-sm font-medium">
                    Special Instructions (Optional)
                  </label>
                  <Textarea
                    id="customization"
                    placeholder="E.g., No onions, extra spicy, etc."
                    value={customization}
                    onChange={(e) => setCustomization(e.target.value)}
                    className="resize-none"
                  />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  className="bg-canteen-orange hover:bg-canteen-orange/90 w-full"
                  onClick={handleAddToCart}
                >
                  Add to Cart - ₹{foodItem.price * quantity}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {inCart && (
          <div className="mt-2 text-xs text-canteen-teal flex items-center">
            <Check size={12} className="mr-1" />
            {cartItem?.quantity} in cart
            {cartItem?.customizations && <span className="ml-1">({cartItem.customizations})</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
