
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, login as apiLogin, logout as apiLogout, getCurrentUser } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Try to get user from localStorage on initial load
    const loadUser = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await apiLogin(email, password);
      setUser(loggedInUser);
      toast.success('Login successful');
      
      if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/menu');
      }
    } catch (error) {
      toast.error('Invalid credentials');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    apiLogout();
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
