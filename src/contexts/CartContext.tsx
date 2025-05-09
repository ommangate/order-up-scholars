
import React, { createContext, useContext, useState } from 'react';
import { CartItem, FoodItem, placeOrder } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/components/ui/sonner";

interface CartContextType {
  items: CartItem[];
  addToCart: (item: FoodItem, quantity?: number, customizations?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateCustomizations: (itemId: string, customizations: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  checkout: (canteenId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  
  const addToCart = (foodItem: FoodItem, quantity = 1, customizations?: string) => {
    setItems(currentItems => {
      // Check if item is already in cart
      const existingItemIndex = currentItems.findIndex(
        item => item.foodItem.id === foodItem.id
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        if (customizations) {
          updatedItems[existingItemIndex].customizations = customizations;
        }
        toast.success(`Updated ${foodItem.name} quantity in cart`);
        return updatedItems;
      } else {
        // Add new item if it doesn't exist
        toast.success(`Added ${foodItem.name} to cart`);
        return [...currentItems, { foodItem, quantity, customizations }];
      }
    });
  };
  
  const removeFromCart = (itemId: string) => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.foodItem.id === itemId);
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.foodItem.name} from cart`);
      }
      return currentItems.filter(item => item.foodItem.id !== itemId);
    });
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.foodItem.id === itemId ? { ...item, quantity } : item
      )
    );
  };
  
  const updateCustomizations = (itemId: string, customizations: string) => {
    setItems(currentItems => 
      currentItems.map(item => 
        item.foodItem.id === itemId ? { ...item, customizations } : item
      )
    );
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  const totalPrice = items.reduce(
    (sum, item) => sum + item.foodItem.price * item.quantity, 
    0
  );
  
  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity, 
    0
  );
  
  const checkout = async (canteenId: string) => {
    if (!user) {
      throw new Error('You must be logged in to place an order');
    }
    
    if (items.length === 0) {
      throw new Error('Your cart is empty');
    }
    
    try {
      await placeOrder({
        userId: user.id,
        canteenId,
        items,
        status: 'pending',
        totalAmount: totalPrice,
      });
      clearCart();
    } catch (error) {
      toast.error('Failed to place order');
      throw error;
    }
  };
  
  return (
    <CartContext.Provider value={{ 
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateCustomizations,
      clearCart,
      totalPrice,
      totalItems,
      checkout 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
