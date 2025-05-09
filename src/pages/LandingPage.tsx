
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [heroImageLoaded, setHeroImageLoaded] = React.useState(false);
  const [canteenImage1Loaded, setCanteenImage1Loaded] = React.useState(false);
  const [canteenImage2Loaded, setCanteenImage2Loaded] = React.useState(false);

  return (
    <div className="flex flex-col min-h-[calc(100vh-144px)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row items-center">
        <div className="flex-1 py-12 md:pr-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-canteen-darkBlue">
            <span className="text-canteen-orange">Hungry</span> on campus?
          </h1>
          <p className="text-lg md:text-xl mb-6 text-gray-600 max-w-lg">
            Order delicious food from your favorite campus canteens quickly and easily. No more waiting in line!
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-canteen-orange hover:bg-canteen-orange/90 text-white px-8 py-6"
              onClick={() => navigate(isAuthenticated ? '/menu' : '/login')}
            >
              {isAuthenticated ? 'View Menu' : 'Get Started'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            {!isAuthenticated && (
              <Button 
                variant="outline" 
                className="px-8 py-6 border-canteen-orange text-canteen-orange hover:bg-canteen-orange/10"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-lg mt-8 md:mt-0">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-64 h-64 bg-canteen-orange/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-canteen-teal/10 rounded-full blur-3xl"></div>
            <div className="relative bg-white rounded-xl overflow-hidden shadow-xl p-4 border">
              <div className="aspect-[4/3] rounded-lg mb-4 overflow-hidden bg-gray-100">
                {!heroImageLoaded && (
                  <div className="w-full h-full flex items-center justify-center">
                    <Skeleton className="w-full h-full" />
                  </div>
                )}
                <img 
                  src="public/lovable-uploads/387eda7b-a4a5-43c7-a3ab-48e9026d1af8.png" 
                  alt="Delicious food from campus canteen" 
                  className={`w-full h-full object-cover ${!heroImageLoaded ? 'hidden' : ''}`}
                  onLoad={() => setHeroImageLoaded(true)}
                  onError={(e) => {
                    // Fallback to previous image if new one fails
                    const target = e.target as HTMLImageElement;
                    target.src = "public/lovable-uploads/360a4112-52fd-464a-b40f-b775ae970bb1.png";
                    setHeroImageLoaded(true);
                  }}
                />
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-100 rounded-md w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded-md w-1/2"></div>
                <div className="h-4 bg-gray-100 rounded-md w-full"></div>
                <div className="flex justify-between mt-2">
                  <div className="h-6 bg-canteen-orange/20 rounded-md w-1/4"></div>
                  <div className="h-8 bg-canteen-orange/30 rounded-md w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-12 rounded-lg mt-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">How It Works</h2>
          <p className="text-gray-600">Simple steps to get your food quickly</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-canteen-orange/10 rounded-full flex items-center justify-center text-canteen-orange font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-bold text-xl mb-2">Browse Menu</h3>
            <p className="text-gray-600">
              Browse menu items from different canteens on campus
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-canteen-orange/10 rounded-full flex items-center justify-center text-canteen-orange font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-bold text-xl mb-2">Place Order</h3>
            <p className="text-gray-600">
              Customize your order and add items to your cart
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-canteen-orange/10 rounded-full flex items-center justify-center text-canteen-orange font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-bold text-xl mb-2">Pick Up Food</h3>
            <p className="text-gray-600">
              Skip the line and collect your food when it's ready
            </p>
          </div>
        </div>
      </section>

      {/* Canteens Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Our Canteens</h2>
          <p className="text-gray-600">Choose from multiple locations across campus</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border rounded-lg overflow-hidden shadow-md">
            <div className="h-48 bg-gray-100 relative">
              {!canteenImage1Loaded && <Skeleton className="w-full h-full" />}
              <img 
                src="public/lovable-uploads/f2a96351-10fb-46bd-a174-58f12fcf3b71.png"
                alt="The Hungry Scholar Canteen"
                className={`w-full h-full object-cover ${!canteenImage1Loaded ? 'hidden' : ''}`}
                onLoad={() => setCanteenImage1Loaded(true)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80";
                  setCanteenImage1Loaded(true);
                }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">The Hungry Scholar</h3>
              <p className="text-gray-600 mb-4">IT Building, MIT ADT University, Pune</p>
              <p className="text-sm text-gray-500">
                Serving breakfast, lunch, snacks, and beverages throughout the day
              </p>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg overflow-hidden shadow-md">
            <div className="h-48 bg-gray-100 relative">
              {!canteenImage2Loaded && <Skeleton className="w-full h-full" />}
              <img 
                src="public/lovable-uploads/0b17af70-df66-409c-a87b-346e67d8d48b.png" 
                alt="Main Campus Canteen"
                className={`w-full h-full object-cover ${!canteenImage2Loaded ? 'hidden' : ''}`}
                onLoad={() => setCanteenImage2Loaded(true)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80";
                  setCanteenImage2Loaded(true);
                }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Main Canteen</h3>
              <p className="text-gray-600 mb-4">Main Campus, MIT ADT University, Pune</p>
              <p className="text-sm text-gray-500">
                Our largest food court with a wide variety of cuisines and options
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Button 
            className="bg-canteen-teal hover:bg-canteen-teal/90"
            onClick={() => navigate(isAuthenticated ? '/menu' : '/login')}
          >
            Explore Menu
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
