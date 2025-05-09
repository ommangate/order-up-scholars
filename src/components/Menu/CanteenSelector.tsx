
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
  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        <h2 className="text-lg font-semibold mb-3">Select Canteen</h2>
        <div className="flex flex-wrap gap-3">
          {canteens.map((canteen) => (
            <Button
              key={canteen.id}
              variant={selectedCanteen === canteen.id ? "default" : "outline"}
              className={selectedCanteen === canteen.id 
                ? "bg-canteen-orange hover:bg-canteen-orange/90" 
                : "border-canteen-orange text-canteen-orange hover:bg-canteen-orange/10"
              }
              onClick={() => onSelectCanteen(canteen.id)}
            >
              {canteen.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CanteenSelector;
