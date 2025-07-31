import { useState } from 'react';
import { FloorData, WindowData } from '../types';

export const useWindowData = () => {
  const [floors, setFloors] = useState<FloorData[]>([
    { id: '1', floorNumber: 1, windows: [] }
  ]);
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);

  const addFloor = () => {
    const newFloorNumber = Math.max(...floors.map(f => f.floorNumber)) + 1;
    const newFloor: FloorData = {
      id: Date.now().toString(),
      floorNumber: newFloorNumber,
      windows: []
    };
    setFloors(prev => [...prev, newFloor]);
  };

  const removeFloor = (floorId: string) => {
    if (floors.length > 1) {
      setFloors(prev => prev.filter(f => f.id !== floorId));
      if (currentFloorIndex >= floors.length - 1) {
        setCurrentFloorIndex(0);
      }
    }
  };

  const addWindow = (floorId: string, windowData: any) => {
    const theoreticalDiagonal = Math.sqrt(Math.pow(windowData.width, 2) + Math.pow(windowData.height, 2));
    const avgDiagonal = (windowData.diagonal1 + windowData.diagonal2) / 2;
    const diagonalDiff = Math.abs(theoreticalDiagonal - avgDiagonal);
    
    let status: 'pass' | 'warning' | 'fail';
    if (diagonalDiff <= 2) status = 'pass';
    else if (diagonalDiff <= 5) status = 'warning';
    else status = 'fail';

    const newWindow: WindowData = {
      id: Date.now().toString(),
      ...windowData,
      theoreticalDiagonal,
      diagonalDiff,
      status
    };

    setFloors(prev => prev.map(floor => 
      floor.id === floorId 
        ? { ...floor, windows: [...floor.windows, newWindow] }
        : floor
    ));
  };

  const removeWindow = (floorId: string, windowId: string) => {
    setFloors(prev => prev.map(floor => 
      floor.id === floorId 
        ? { ...floor, windows: floor.windows.filter(w => w.id !== windowId) }
        : floor
    ));
  };

  const clearAllData = () => {
    setFloors([{ id: '1', floorNumber: 1, windows: [] }]);
    setCurrentFloorIndex(0);
  };

  return {
    floors,
    currentFloorIndex,
    setCurrentFloorIndex,
    addFloor,
    removeFloor,
    addWindow,
    removeWindow,
    clearAllData
  };
};