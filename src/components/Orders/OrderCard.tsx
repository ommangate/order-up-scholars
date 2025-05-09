
import React from 'react';
import { Order, Canteen } from '@/services/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface OrderCardProps {
  order: Order;
  canteens: Canteen[];
}

const OrderStatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'preparing':
        return 'bg-blue-500';
      case 'ready':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Badge className={`${getStatusColor()} capitalize`}>
      {status}
    </Badge>
  );
};

const OrderCard: React.FC<OrderCardProps> = ({ order, canteens }) => {
  const canteen = canteens.find(c => c.id === order.canteenId);
  
  const formattedDate = format(new Date(order.createdAt), 'MMM d, yyyy - h:mm a');
  
  return (
    <Card className="border-t-4 border-t-canteen-orange">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">{formattedDate}</p>
            <CardTitle className="mt-1">Order #{order.id}</CardTitle>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">Canteen</p>
          <p>{canteen?.name || 'Unknown'}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Items</p>
          <ul className="space-y-2">
            {order.items.map((item, index) => (
              <li key={index} className="border-b pb-2 last:border-0 last:pb-0">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.foodItem.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x ₹{item.foodItem.price}
                    </p>
                    {item.customizations && (
                      <p className="text-xs italic text-gray-500">
                        "{item.customizations}"
                      </p>
                    )}
                  </div>
                  <p className="font-medium">₹{item.quantity * item.foodItem.price}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <span className="font-medium">Total</span>
        <span className="font-bold text-canteen-orange">₹{order.totalAmount}</span>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
