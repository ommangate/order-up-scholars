
import React from 'react';
import { Canteen } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
  // Images for canteens
  const canteenImages = {
    '1': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    '2': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
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
              <div 
                className="h-32 bg-cover bg-center" 
                style={{ backgroundImage: `url(${canteenImages[canteen.id as keyof typeof canteenImages] || '/placeholder.svg'})` }}
              />
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
