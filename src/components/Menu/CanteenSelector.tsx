
import React, { useState } from 'react';
import { Canteen } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CanteenSelectorProps {
  canteens: Canteen[];
  selectedCanteen: string | null;
  onSelectCanteen: (canteenId: string) => void;
}

const CanteenSelector: React.FC<CanteenSelectorProps> = ({
  canteens,
  selectedCanteen,
  onSelectCanteen,
}) => {
  // Track loading state for each canteen image
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // Images for canteens with fallbacks
  const canteenImages = {
    '1': 'public/lovable-uploads/f2a96351-10fb-46bd-a174-58f12fcf3b71.png',
    '2': 'public/lovable-uploads/0b17af70-df66-409c-a87b-346e67d8d48b.png',
  };

  // Fallback images if primary images fail
  const fallbackImages = {
    '1': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    '2': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  };

  const handleImageLoad = (canteenId: string) => {
    setLoadedImages(prev => ({ ...prev, [canteenId]: true }));
  };

  const handleImageError = (canteenId: string, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = fallbackImages[canteenId as keyof typeof fallbackImages] || '/placeholder.svg';
    handleImageLoad(canteenId);
  };

  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        <h2 className="text-lg font-semibold mb-3">Select Canteen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {canteens.map((canteen) => (
            <div
              key={canteen.id}
              className={`rounded-lg overflow-hidden border cursor-pointer transition-all ${
                selectedCanteen === canteen.id 
                  ? "border-canteen-orange ring-2 ring-canteen-orange/30" 
                  : "border-gray-200 hover:border-canteen-orange/70"
              }`}
              onClick={() => onSelectCanteen(canteen.id)}
            >
              <div className="h-32 bg-gray-100 relative">
                {!loadedImages[canteen.id] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Skeleton className="w-full h-full" />
                  </div>
                )}
                <img 
                  src={canteenImages[canteen.id as keyof typeof canteenImages] || '/placeholder.svg'}
                  alt={canteen.name}
                  className="h-full w-full object-cover"
                  onLoad={() => handleImageLoad(canteen.id)}
                  onError={(e) => handleImageError(canteen.id, e)}
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium">{canteen.name}</h3>
                <p className="text-xs text-gray-500">{canteen.location}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CanteenSelector;
