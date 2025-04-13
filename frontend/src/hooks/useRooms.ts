import { useContext } from 'react';
import { RoomContext } from '@/context/RoomContext';

export const useRooms = () => {
  const context = useContext(RoomContext);
  
  if (context === undefined) {
    throw new Error('useRooms must be used within a RoomProvider');
  }

  console.log('useRooms context:', context);
  return context;
};