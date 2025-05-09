
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus, Trash, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, updateCustomizations, totalPrice, checkout } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [editingCustomization, setEditingCustomization] = useState<{ id: string, value: string } | null>(null);
  
  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setCheckoutLoading(true);
    try {
      // For simplicity, we're using the canteen ID of the first item
      // In a real app, you might want to allow ordering from only one canteen at a time
      const canteenId = items[0].foodItem.canteenId;
      await checkout(canteenId);
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Failed to place order');
    } finally {
      setCheckoutLoading(false);
      setShowCheckoutDialog(false);
    }
  };
  
  const handleSaveCustomization = (itemId: string) => {
    if (!editingCustomization) return;
    
    updateCustomizations(itemId, editingCustomization.value);
    setEditingCustomization(null);
  };
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-4">Please log in to view your cart</h1>
        <Button onClick={() => navigate('/login')}>Log In</Button>
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some delicious items to get started!</p>
        <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
      </div>
    );
  }
  
  const canteenName = items.length > 0 ? items[0].foodItem.canteenId : null;
  const allSameCanteen = items.every(item => item.foodItem.canteenId === canteenName);
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      {!allSameCanteen && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-800">
            Your cart contains items from different canteens. 
            Please note that you can only order from one canteen at a time.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {items.map((item) => (
                  <li key={item.foodItem.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0">
                        {item.foodItem.image && (
                          <div 
                            className="w-full h-full bg-center bg-cover rounded-md" 
                            style={{ backgroundImage: `url(${item.foodItem.image})` }}
                          ></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{item.foodItem.name}</h3>
                            <p className="text-sm text-gray-500">
                              ₹{item.foodItem.price} each
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{item.foodItem.price * item.quantity}</p>
                          </div>
                        </div>
                        
                        {editingCustomization && editingCustomization.id === item.foodItem.id ? (
                          <div className="mt-2 flex items-center gap-2">
                            <Textarea 
                              value={editingCustomization.value} 
                              onChange={(e) => setEditingCustomization({ id: item.foodItem.id, value: e.target.value })}
                              placeholder="Add special instructions..."
                              className="text-sm resize-none h-20"
                            />
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleSaveCustomization(item.foodItem.id)}
                            >
                              <Check size={16} />
                            </Button>
                          </div>
                        ) : item.customizations ? (
                          <div className="mt-1 flex items-center gap-2">
                            <p className="text-sm italic text-gray-500">"{item.customizations}"</p>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => setEditingCustomization({ id: item.foodItem.id, value: item.customizations || '' })}
                              className="h-6 w-6 p-0"
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              >
                                <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                              </svg>
                            </Button>
                          </div>
                        ) : (
                          <button 
                            className="mt-1 text-sm text-canteen-teal hover:text-canteen-teal/80"
                            onClick={() => setEditingCustomization({ id: item.foodItem.id, value: '' })}
                          >
                            Add special instructions
                          </button>
                        )}
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border rounded-md">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2"
                              onClick={() => updateQuantity(item.foodItem.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </Button>
                            <span className="px-2 text-center min-w-[2rem]">
                              {item.quantity}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2"
                              onClick={() => updateQuantity(item.foodItem.id, item.quantity + 1)}
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => removeFromCart(item.foodItem.id)}
                          >
                            <Trash size={16} className="mr-1" /> Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Tax</span>
                  <span>₹0.00</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-canteen-orange hover:bg-canteen-orange/90"
                onClick={() => setShowCheckoutDialog(true)}
                disabled={items.length === 0 || checkoutLoading}
              >
                {checkoutLoading ? 'Processing...' : 'Place Order'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <AlertDialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Order</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to place an order for {items.length} item(s) with a total of ₹{totalPrice}.
              Proceed to checkout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-canteen-orange hover:bg-canteen-orange/90"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? 'Processing...' : 'Place Order'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CartPage;
