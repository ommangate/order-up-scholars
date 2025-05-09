
import React, { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus, Order, fetchCanteens, Canteen } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateOrderId, setUpdateOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status']>('pending');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, canteensData] = await Promise.all([
          fetchOrders(),
          fetchCanteens(),
        ]);
        setOrders(ordersData);
        setCanteens(canteensData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleUpdateStatus = async () => {
    if (!updateOrderId || !newStatus) return;
    
    try {
      await updateOrderStatus(updateOrderId, newStatus);
      setOrders(orders.map(order => 
        order.id === updateOrderId ? { ...order, status: newStatus } : order
      ));
      setUpdateOrderId(null);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getCanteenName = (canteenId: string) => {
    return canteens.find(c => c.id === canteenId)?.name || 'Unknown';
  };
  
  const filterOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };
  
  const pendingOrders = filterOrdersByStatus('pending');
  const preparingOrders = filterOrdersByStatus('preparing');
  const readyOrders = filterOrdersByStatus('ready');
  const completedOrders = filterOrdersByStatus('completed');
  
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const renderOrderCard = (order: Order) => (
    <Card key={order.id} className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between">
          <span>Order #{order.id}</span>
          <Badge className="ml-2" variant={order.status === 'cancelled' ? 'destructive' : 'outline'}>
            {order.status}
          </Badge>
        </CardTitle>
        <CardDescription>
          {format(new Date(order.createdAt), 'MMM d, yyyy - h:mm a')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Canteen</p>
            <p>{getCanteenName(order.canteenId)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Items</p>
            <ul className="divide-y">
              {order.items.map((item, idx) => (
                <li key={idx} className="py-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">
                        {item.quantity} x {item.foodItem.name}
                      </p>
                      {item.customizations && (
                        <p className="text-sm text-gray-500">"{item.customizations}"</p>
                      )}
                    </div>
                    <p>₹{item.foodItem.price * item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-between pt-2 border-t">
            <p className="font-medium">Total</p>
            <p className="font-bold">₹{order.totalAmount}</p>
          </div>
          
          <div className="pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setUpdateOrderId(order.id);
                setNewStatus(order.status);
              }}
            >
              Update Status
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingOrders.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingOrders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-0">
          {pendingOrders.length > 0 ? (
            pendingOrders.map(renderOrderCard)
          ) : (
            <p className="text-center py-8 text-gray-500">No pending orders</p>
          )}
        </TabsContent>
        
        <TabsContent value="preparing" className="mt-0">
          {preparingOrders.length > 0 ? (
            preparingOrders.map(renderOrderCard)
          ) : (
            <p className="text-center py-8 text-gray-500">No orders in preparation</p>
          )}
        </TabsContent>
        
        <TabsContent value="ready" className="mt-0">
          {readyOrders.length > 0 ? (
            readyOrders.map(renderOrderCard)
          ) : (
            <p className="text-center py-8 text-gray-500">No orders ready for pickup</p>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          {completedOrders.length > 0 ? (
            completedOrders.map(renderOrderCard)
          ) : (
            <p className="text-center py-8 text-gray-500">No completed orders</p>
          )}
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={!!updateOrderId} onOpenChange={(open) => !open && setUpdateOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Order Status</AlertDialogTitle>
            <AlertDialogDescription>
              Change the status of Order #{updateOrderId}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Order['status'])}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpdateStatus}
              className="bg-canteen-orange hover:bg-canteen-orange/90"
            >
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrderManagement;
