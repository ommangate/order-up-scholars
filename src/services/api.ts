import { toast } from "@/components/ui/sonner";

// Types for our application
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'student' | 'admin';
}

export interface Canteen {
  id: string;
  name: string;
  location: string;
}

export interface FoodCategory {
  id: string;
  name: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  canteenId: string;
  available: boolean;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  customizations?: string;
}

export interface Order {
  id: string;
  userId: string;
  canteenId: string;
  items: CartItem[];
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  qrCode?: string;
}

// Mock data for our application
const canteens: Canteen[] = [
  {
    id: '1',
    name: 'The Hungry Scholar',
    location: 'IT Building, MIT ADT University, Pune',
  },
  {
    id: '2',
    name: 'Main Canteen',
    location: 'Main Campus, MIT ADT University, Pune',
  },
];

const foodCategories: FoodCategory[] = [
  { id: '1', name: 'Breakfast' },
  { id: '2', name: 'Juices/Fresh Fruits' },
  { id: '3', name: 'Hot Drinks' },
  { id: '4', name: 'Shakes' },
  { id: '5', name: 'Salads' },
  { id: '6', name: 'Starters' },
  { id: '7', name: 'Lunch' },
  { id: '8', name: 'Evening Snacks' },
  { id: '9', name: 'Desserts' },
  { id: '10', name: 'Beverages' },
];

const foodItems: FoodItem[] = [
  // Breakfast items
  {
    id: '1',
    name: 'Poha',
    description: 'Flattened rice with herbs and spices',
    price: 30,
    categoryId: '1',
    canteenId: '1',
    available: true,
    image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    name: 'Idli Sambhar',
    description: 'Steamed rice cakes with lentil soup',
    price: 40,
    categoryId: '1',
    canteenId: '1',
    available: true,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    name: 'Vada Pav',
    description: 'Spicy potato fritter in a bun',
    price: 20,
    categoryId: '1',
    canteenId: '1',
    available: true,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    name: 'Toast Sandwich',
    description: 'Grilled sandwich with vegetables',
    price: 35,
    categoryId: '1',
    canteenId: '2',
    available: true,
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  },
  
  // Hot Drinks
  {
    id: '5',
    name: 'Tea',
    description: 'Indian masala chai',
    price: 15,
    categoryId: '3',
    canteenId: '1',
    available: true,
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '6',
    name: 'Coffee',
    description: 'Hot coffee with milk',
    price: 20,
    categoryId: '3',
    canteenId: '1',
    available: true,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  },
  
  // Shakes
  {
    id: '7',
    name: 'Chocolate Shake',
    description: 'Rich chocolate milkshake',
    price: 60,
    categoryId: '4',
    canteenId: '1',
    available: true,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '8',
    name: 'Mango Shake',
    description: 'Fresh mango milkshake',
    price: 70,
    categoryId: '4',
    canteenId: '2',
    available: true,
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  },
  
  // Lunch items
  {
    id: '9',
    name: 'Thali',
    description: 'Full meal with roti, rice, dal, sabzi, and more',
    price: 100,
    categoryId: '7',
    canteenId: '1',
    available: true,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '10',
    name: 'Biryani',
    description: 'Spiced rice dish with vegetables',
    price: 90,
    categoryId: '7',
    canteenId: '1',
    available: true,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  },
  
  // Evening Snacks
  {
    id: '11',
    name: 'Samosa',
    description: 'Fried pastry with spiced potato filling',
    price: 15,
    categoryId: '8',
    canteenId: '1',
    available: true,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '12',
    name: 'Kachori',
    description: 'Fried spicy snack',
    price: 20,
    categoryId: '8',
    canteenId: '2',
    available: true,
    image: 'https://images.unsplash.com/photo-1589286275712-40a7defe7f14?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  },
];

// Mock users for authentication
const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '1234567890',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Student User',
    email: 'student@example.com',
    phone: '9876543210',
    role: 'student',
  },
];

// Mock orders
const orders: Order[] = [
  {
    id: '1',
    userId: '2',
    canteenId: '1',
    items: [
      { foodItem: foodItems[0], quantity: 1, customizations: 'Extra spicy' },
      { foodItem: foodItems[4], quantity: 1 }
    ],
    status: 'completed',
    totalAmount: 45,
    createdAt: '2023-05-08T10:30:00Z',
    qrCode: 'mock-qr-code-1',
  },
  {
    id: '2',
    userId: '2',
    canteenId: '1',
    items: [
      { foodItem: foodItems[8], quantity: 1 }
    ],
    status: 'pending',
    totalAmount: 100,
    createdAt: '2023-05-09T12:45:00Z',
    qrCode: 'mock-qr-code-2',
  }
];

// Get the current user from localStorage
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  if (userJson) {
    return JSON.parse(userJson);
  }
  return null;
};

// Login function (simulating API call)
export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In a real app, we would make an API call to verify credentials
      const user = users.find(u => u.email === email);
      if (user && password === 'password') {
        localStorage.setItem('currentUser', JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('currentUser');
};

// Fetch canteens
export const fetchCanteens = (): Promise<Canteen[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(canteens);
    }, 500);
  });
};

// Fetch food categories
export const fetchFoodCategories = (): Promise<FoodCategory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(foodCategories);
    }, 500);
  });
};

// Fetch food items by canteen and category
export const fetchFoodItems = (canteenId?: string, categoryId?: string): Promise<FoodItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredItems = [...foodItems];
      
      if (canteenId) {
        filteredItems = filteredItems.filter(item => item.canteenId === canteenId);
      }
      
      if (categoryId) {
        filteredItems = filteredItems.filter(item => item.categoryId === categoryId);
      }
      
      resolve(filteredItems);
    }, 500);
  });
};

// Toggle food item availability
export const toggleFoodItemAvailability = (itemId: string): Promise<FoodItem> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const itemIndex = foodItems.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        foodItems[itemIndex].available = !foodItems[itemIndex].available;
        resolve(foodItems[itemIndex]);
      }
    }, 500);
  });
};

// Add food item
export const addFoodItem = (item: Omit<FoodItem, 'id'>): Promise<FoodItem> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem = {
        ...item,
        id: (foodItems.length + 1).toString(),
      };
      foodItems.push(newItem);
      toast.success("Item added successfully");
      resolve(newItem);
    }, 800);
  });
};

// Update food item
export const updateFoodItem = (item: FoodItem): Promise<FoodItem> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const itemIndex = foodItems.findIndex(fi => fi.id === item.id);
      if (itemIndex !== -1) {
        foodItems[itemIndex] = item;
        toast.success("Item updated successfully");
        resolve(item);
      }
    }, 800);
  });
};

// Delete food item
export const deleteFoodItem = (itemId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const itemIndex = foodItems.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        foodItems.splice(itemIndex, 1);
        toast.success("Item deleted successfully");
        resolve(true);
      } else {
        resolve(false);
      }
    }, 800);
  });
};

// Place order
export const placeOrder = (order: Omit<Order, 'id' | 'createdAt' | 'qrCode'>): Promise<Order> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newOrder = {
        ...order,
        id: (orders.length + 1).toString(),
        createdAt: new Date().toISOString(),
        qrCode: `mock-qr-code-${orders.length + 1}`,
      };
      orders.push(newOrder);
      toast.success("Order placed successfully");
      resolve(newOrder);
    }, 800);
  });
};

// Fetch orders for user
export const fetchOrders = (userId?: string): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userId) {
        resolve(orders.filter(order => order.userId === userId));
      } else {
        resolve(orders);
      }
    }, 800);
  });
};

// Update order status
export const updateOrderStatus = (orderId: string, status: Order['status']): Promise<Order> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderIndex = orders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        toast.success(`Order status updated to ${status}`);
        resolve(orders[orderIndex]);
      }
    }, 800);
  });
};
