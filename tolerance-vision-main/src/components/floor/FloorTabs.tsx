import React from 'react';
import { Plus, X } from 'lucide-react';
import { FloorData } from '@/types';

interface FloorTabsProps {
  floors: FloorData[];
  currentFloorIndex: number;
  onFloorSelect: (index: number) => void;
  onAddFloor: () => void;
  onRemoveFloor: (floorId: string) => void;
}

export const FloorTabs: React.FC<FloorTabsProps> = ({
  floors,
  currentFloorIndex,
  onFloorSelect,
  onAddFloor,
  onRemoveFloor
}) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
      {floors.map((floor, index) => (
        <div
          key={floor.id}
          className={`
            relative group flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer transition-all duration-300 min-w-fit
            ${currentFloorIndex === index
              ? 'bg-card shadow-lg text-primary border-2 border-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }
          `}
          onClick={() => onFloorSelect(index)}
        >
          <span className="font-semibold">طبقه {floor.floorNumber}</span>
          {floor.windows.length > 0 && (
            <span className={`
              text-xs px-2 py-1 rounded-full font-medium
              ${currentFloorIndex === index 
                ? 'bg-primary/10 text-primary' 
                : 'bg-muted text-muted-foreground'
              }
            `}>
              {floor.windows.length}
            </span>
          )}
          {floors.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFloor(floor.id);
              }}
              className="absolute -top-2 -left-2 p-1.5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
      
      <button
        onClick={onAddFloor}
        className="flex items-center gap-2 px-6 py-3 text-sm text-secondary hover:text-secondary-foreground hover:bg-secondary/10 rounded-xl transition-all duration-300 hover:shadow-md border-2 border-dashed border-secondary/30 hover:border-secondary min-w-fit"
      >
        <Plus className="w-4 h-4" />
        <span className="font-medium">طبقه جدید</span>
      </button>
    </div>
  );
};