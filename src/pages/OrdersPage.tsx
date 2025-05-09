
import React, { useEffect, useState } from 'react';
import { fetchOrders, fetchCanteens, Order, Canteen } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import OrderCard from '@/components/Orders/OrderCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersData, canteensData] = await Promise.all([
          fetchOrders(user.id),
          fetchCanteens(),
        ]);
        
        // Sort orders by createdAt (most recent first)
        const sortedOrders = [...ordersData].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setOrders(sortedOrders);
        setCanteens(canteensData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-4">Please log in to view your orders</h1>
        <Button onClick={() => navigate('/login')}>Log In</Button>
      </div>
    );
  }
  
  const pendingOrders = orders.filter(order => !['completed', 'cancelled'].includes(order.status));
  const completedOrders = orders.filter(order => ['completed', 'cancelled'].includes(order.status));
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center">
          <p className="text-xl mb-4">You haven't placed any orders yet</p>
          <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
        </div>
      ) : (
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="mb-6 grid grid-cols-2">
            <TabsTrigger value="current">Current Orders</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            {pendingOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingOrders.map(order => (
                  <div key={order.id} className="relative">
                    <OrderCard order={order} canteens={canteens} />
                    {order.qrCode && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-4 right-4"
                        onClick={() => setSelectedQrCode(order.qrCode || null)}
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        QR Code
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                You don't have any current orders
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            {completedOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedOrders.map(order => (
                  <OrderCard key={order.id} order={order} canteens={canteens} />
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                You don't have any completed orders
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
      
      <Dialog open={!!selectedQrCode} onOpenChange={(isOpen) => !isOpen && setSelectedQrCode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            <div className="bg-white p-4 rounded-lg shadow-md border">
              {/* In a real app, this would be a real QR code */}
              <div className="w-64 h-64 bg-gray-200 grid grid-cols-10 grid-rows-10 gap-1">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`${Math.random() > 0.7 ? 'bg-black' : 'bg-white'}`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Show this QR code to the canteen staff when collecting your order
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
