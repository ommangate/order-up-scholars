
import React, { useState } from 'react';
import { FoodItem, Canteen, FoodCategory, toggleFoodItemAvailability, updateFoodItem, deleteFoodItem } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FoodItemForm from './FoodItemForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface AdminFoodItemProps {
  foodItem: FoodItem;
  canteens: Canteen[];
  categories: FoodCategory[];
  onUpdate: () => void;
}

const AdminFoodItem: React.FC<AdminFoodItemProps> = ({ 
  foodItem, 
  canteens, 
  categories, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const canteen = canteens.find(c => c.id === foodItem.canteenId)?.name || 'Unknown';
  const category = categories.find(c => c.id === foodItem.categoryId)?.name || 'Unknown';
  
  const handleToggleAvailability = async () => {
    setIsUpdating(true);
    try {
      await toggleFoodItemAvailability(foodItem.id);
      onUpdate();
    } catch (error) {
      console.error('Failed to toggle availability:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleUpdateFoodItem = async (updatedItem: FoodItem) => {
    try {
      await updateFoodItem(updatedItem);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to update food item:', error);
    }
  };
  
  const handleDeleteFoodItem = async () => {
    try {
      await deleteFoodItem(foodItem.id);
      setIsDeleting(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete food item:', error);
    }
  };
  
  return (
    <>
      <Card className="h-full">
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold">{foodItem.name}</h3>
              <p className="text-sm text-gray-500">{category}</p>
            </div>
            <span className="text-canteen-orange font-bold">₹{foodItem.price}</span>
          </div>
          
          {foodItem.description && (
            <p className="text-sm text-gray-600 mb-3 flex-1">{foodItem.description}</p>
          )}
          
          <div className="flex flex-col space-y-3 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-sm">{canteen}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {foodItem.available ? 'Available' : 'Unavailable'}
                </span>
                <Switch 
                  checked={foodItem.available} 
                  onCheckedChange={handleToggleAvailability}
                  disabled={isUpdating}
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setIsEditing(true)}
              >
                <Pencil size={16} className="mr-1" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                onClick={() => setIsDeleting(true)}
              >
                <Trash2 size={16} className="mr-1" /> Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Food Item</DialogTitle>
          </DialogHeader>
          <FoodItemForm
            foodItem={foodItem}
            canteens={canteens}
            categories={categories}
            onSubmit={handleUpdateFoodItem}
            onCancel={() => setIsEditing(false)}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the food item "{foodItem.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteFoodItem}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminFoodItem;
