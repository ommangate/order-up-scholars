
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FoodItem, Canteen, FoodCategory } from '@/services/api';
import { Image } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  categoryId: z.string({ required_error: 'Please select a category' }),
  canteenId: z.string({ required_error: 'Please select a canteen' }),
  available: z.boolean().default(true),
  image: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FoodItemFormProps {
  foodItem?: FoodItem;
  canteens: Canteen[];
  categories: FoodCategory[];
  onSubmit: (data: Omit<FoodItem, 'id'> | FoodItem) => Promise<void>;
  onCancel: () => void;
}

const FoodItemForm: React.FC<FoodItemFormProps> = ({ 
  foodItem, 
  canteens, 
  categories, 
  onSubmit,
  onCancel
}) => {
  const isEditing = !!foodItem;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: foodItem?.name || '',
      description: foodItem?.description || '',
      price: foodItem?.price || 0,
      categoryId: foodItem?.categoryId || '',
      canteenId: foodItem?.canteenId || '',
      available: foodItem?.available ?? true,
      image: foodItem?.image || '',
    },
  });
  
  const handleSubmit = async (data: FormValues) => {
    try {
      if (isEditing && foodItem) {
        // When editing, preserve the ID
        await onSubmit({ 
          id: foodItem.id,
          name: data.name,
          description: data.description,
          price: data.price,
          categoryId: data.categoryId,
          canteenId: data.canteenId,
          available: data.available,
          image: data.image 
        });
      } else {
        // When creating, submit all required fields for a new food item
        await onSubmit({
          name: data.name,
          description: data.description,
          price: data.price,
          categoryId: data.categoryId,
          canteenId: data.canteenId,
          available: data.available,
          image: data.image,
        });
      }
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the item" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Image URL for the food item" 
                        {...field}
                        value={field.value || ''}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          window.open(field.value || '/placeholder.svg', '_blank');
                        }}
                      >
                        <Image size={18} />
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Paste a direct URL to an image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="canteenId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Canteen</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a canteen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {canteens.map((canteen) => (
                        <SelectItem key={canteen.id} value={canteen.id}>
                          {canteen.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Available</FormLabel>
                    <FormDescription>
                      This item will be shown to customers
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('image') && (
              <div className="mt-4 border rounded-md overflow-hidden">
                <p className="text-sm font-medium p-2 bg-gray-50 border-b">Image Preview</p>
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <img 
                    src={form.watch('image') || '/placeholder.svg'} 
                    alt="Food item preview" 
                    className="max-h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-canteen-orange hover:bg-canteen-orange/90"
          >
            {isEditing ? 'Update' : 'Create'} Item
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FoodItemForm;
