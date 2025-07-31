import React from 'react';
import { FloorTabs } from './FloorTabs';
import { WindowForm } from '../window/WindowForm';
import { WindowList } from '../window/WindowList';
import { FloorData, ProjectInfo } from '@/types';
import { Layers } from 'lucide-react';

interface FloorManagerProps {
  floors: FloorData[];
  currentFloorIndex: number;
  projectInfo: ProjectInfo;
  onFloorSelect: (index: number) => void;
  onAddFloor: () => void;
  onRemoveFloor: (floorId: string) => void;
  onAddWindow: (floorId: string, windowData: any) => void;
  onRemoveWindow: (floorId: string, windowId: string) => void;
}

export const FloorManager: React.FC<FloorManagerProps> = ({
  floors,
  currentFloorIndex,
  onFloorSelect,
  onAddFloor,
  onRemoveFloor,
  onAddWindow,
  onRemoveWindow
}) => {
  const currentFloor = floors[currentFloorIndex];

  return (
    <div className="space-y-8">
      {/* Floor Tabs */}
      <div className="bg-muted/30 rounded-2xl p-2 border border-border">
        <FloorTabs
          floors={floors}
          currentFloorIndex={currentFloorIndex}
          onFloorSelect={onFloorSelect}
          onAddFloor={onAddFloor}
          onRemoveFloor={onRemoveFloor}
        />
      </div>
      
      {currentFloor && (
        <div className="space-y-8">
          {/* Window Form */}
          <div className="bg-gradient-subtle rounded-2xl p-8 border-2 border-secondary/20 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-secondary/10 rounded-xl">
                <Layers className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                افزودن پنجره به طبقه {currentFloor.floorNumber}
              </h3>
            </div>
            <WindowForm
              floorNumber={currentFloor.floorNumber}
              onSubmit={(data) => onAddWindow(currentFloor.id, data)}
            />
          </div>
          
          {/* Window List */}
          {currentFloor.windows.length > 0 && (
            <WindowList
              windows={currentFloor.windows}
              floorNumber={currentFloor.floorNumber}
              onRemove={(windowId) => onRemoveWindow(currentFloor.id, windowId)}
            />
          )}
        </div>
      )}
    </div>
  );
};