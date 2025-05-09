
import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, Menu, User, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const MainLayout: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-canteen-orange">OrderUp</span>
              <span className="text-canteen-teal font-semibold">Scholars</span>
            </Link>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-4">
              {isAuthenticated && (
                <Link to="/cart" className="relative">
                  <ShoppingCart className="w-6 h-6 text-canteen-orange" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-canteen-teal text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.2rem] flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col py-8">
                  <div className="flex-1 space-y-4 py-4">
                    {isAuthenticated ? (
                      <>
                        <div className="px-3 py-2 border-b">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-canteen-orange flex items-center justify-center">
                              <User className="text-white" size={20} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold">{user?.name}</span>
                              <span className="text-sm text-gray-500">{user?.email}</span>
                            </div>
                          </div>
                        </div>
                        <nav className="space-y-2 px-2">
                          <Link 
                            to="/menu" 
                            className={`block px-3 py-2 rounded-md ${isActive('/menu') ? 'bg-canteen-orange text-white' : 'hover:bg-muted'}`}>
                            Menu
                          </Link>
                          <Link 
                            to="/orders" 
                            className={`block px-3 py-2 rounded-md ${isActive('/orders') ? 'bg-canteen-orange text-white' : 'hover:bg-muted'}`}>
                            My Orders
                          </Link>
                          {user?.role === 'admin' && (
                            <Link 
                              to="/admin" 
                              className={`block px-3 py-2 rounded-md ${isActive('/admin') ? 'bg-canteen-orange text-white' : 'hover:bg-muted'}`}>
                              Admin Dashboard
                            </Link>
                          )}
                        </nav>
                      </>
                    ) : (
                      <nav className="space-y-2 px-2">
                        <Link 
                          to="/" 
                          className={`block px-3 py-2 rounded-md ${isActive('/') ? 'bg-canteen-orange text-white' : 'hover:bg-muted'}`}>
                          Home
                        </Link>
                        <Link 
                          to="/login" 
                          className={`block px-3 py-2 rounded-md ${isActive('/login') ? 'bg-canteen-orange text-white' : 'hover:bg-muted'}`}>
                          Login
                        </Link>
                      </nav>
                    )}
                  </div>
                  
                  {isAuthenticated && (
                    <div className="border-t pt-4 px-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-500" 
                        onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/menu" 
                    className={`font-medium ${isActive('/menu') ? 'text-canteen-orange' : 'text-gray-600 hover:text-canteen-orange'}`}>
                    Menu
                  </Link>
                  <Link 
                    to="/orders" 
                    className={`font-medium ${isActive('/orders') ? 'text-canteen-orange' : 'text-gray-600 hover:text-canteen-orange'}`}>
                    My Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className={`font-medium ${isActive('/admin') ? 'text-canteen-orange' : 'text-gray-600 hover:text-canteen-orange'}`}>
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/cart" className="relative">
                    <ShoppingCart className="w-6 h-6 text-canteen-orange" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-canteen-teal text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.2rem] flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  <div className="border-l pl-6 flex items-center space-x-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{user?.name}</span>
                      <span className="text-xs text-gray-500">{user?.email}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={logout} 
                      className="hover:text-red-500">
                      <LogOut className="w-5 h-5" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/" 
                    className={`font-medium ${isActive('/') ? 'text-canteen-orange' : 'text-gray-600 hover:text-canteen-orange'}`}>
                    Home
                  </Link>
                  <Button 
                    onClick={() => navigate('/login')} 
                    className="bg-canteen-orange hover:bg-canteen-orange/90">
                    Login
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-gray-50 border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-canteen-orange">OrderUp</span>
                <span className="text-canteen-teal font-semibold">Scholars</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">College Canteen Management System</p>
            </div>
            
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} MIT ADT University, Pune. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
