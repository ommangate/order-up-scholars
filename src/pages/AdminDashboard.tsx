
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchCanteens, fetchFoodCategories, fetchFoodItems, addFoodItem, Canteen, FoodCategory, FoodItem } from '@/services/api';
import AdminFoodItem from '@/components/Admin/AdminFoodItem';
import FoodItemForm from '@/components/Admin/FoodItemForm';
import OrderManagement from '@/components/Admin/OrderManagement';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  
  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const [canteensData, categoriesData, foodItemsData] = await Promise.all([
          fetchCanteens(),
          fetchFoodCategories(),
          fetchFoodItems(),
        ]);
        
        setCanteens(canteensData);
        setCategories(categoriesData);
        setFoodItems(foodItemsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  const refreshFoodItems = async () => {
    try {
      const items = await fetchFoodItems();
      setFoodItems(items);
    } catch (error) {
      console.error('Error refreshing food items:', error);
    }
  };
  
  const handleAddFoodItem = async (item: Omit<FoodItem, 'id'>) => {
    try {
      await addFoodItem(item);
      await refreshFoodItems();
      setShowAddItemDialog(false);
    } catch (error) {
      console.error('Error adding food item:', error);
    }
  };
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="text-gray-500 mb-6">You don't have permission to view this page</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }
  
  const itemsByCanteen = canteens.map(canteen => ({
    name: canteen.name,
    items: foodItems.filter(item => item.canteenId === canteen.id).length,
  }));
  
  const itemsByCategory = categories.map(category => ({
    name: category.name,
    value: foodItems.filter(item => item.categoryId === category.id).length,
  }));
  
  const availabilityData = [
    {
      name: 'Available',
      value: foodItems.filter(item => item.available).length,
    },
    {
      name: 'Unavailable',
      value: foodItems.filter(item => !item.available).length,
    },
  ];
  
  const COLORS = ['#FF6B35', '#2EC4B6', '#FFCB77', '#E71D36', '#5E2CA5'];
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="mb-6 grid grid-cols-3">
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
          <TabsTrigger value="orders">Order Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="menu">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Menu Items</h2>
            <Button 
              className="bg-canteen-orange hover:bg-canteen-orange/90"
              onClick={() => setShowAddItemDialog(true)}
            >
              Add New Item
            </Button>
          </div>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">Loading menu items...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodItems.map(item => (
                <AdminFoodItem
                  key={item.id}
                  foodItem={item}
                  canteens={canteens}
                  categories={categories}
                  onUpdate={refreshFoodItems}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="orders">
          <OrderManagement />
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Items by Canteen</CardTitle>
                <CardDescription>Number of menu items at each canteen</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={itemsByCanteen}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="items" fill="#FF6B35" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Item Availability</CardTitle>
                <CardDescription>Available vs. unavailable items</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={availabilityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {availabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#2EC4B6' : '#E71D36'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Items by Category</CardTitle>
              <CardDescription>Distribution of menu items across categories</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={itemsByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {itemsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Food Item</DialogTitle>
          </DialogHeader>
          <FoodItemForm
            canteens={canteens}
            categories={categories}
            onSubmit={handleAddFoodItem}
            onCancel={() => setShowAddItemDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
