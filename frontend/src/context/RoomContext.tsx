import { createContext, useState, useEffect, ReactNode } from 'react';
import { getJoinedRooms, getRoomById, Room } from '@/api/rooms';
import { useAuth } from '@/hooks/useAuth';

interface RoomContextType {
  userRooms: Room[];
  loading: boolean;
  error: string | null;
  refreshRooms: () => Promise<void>;
  clearRooms: () => void;
}

export const RoomContext = createContext<RoomContextType>({
  userRooms: [],
  loading: true,
  error: null,
  refreshRooms: async () => {},
  clearRooms: () => {},
});

interface RoomProviderProps {
  children: ReactNode;
}

export const RoomProvider = ({ children }: RoomProviderProps) => {
  const [userRooms, setUserRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchRooms = async () => {
    if (!user) {
      setUserRooms([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const rooms = await getJoinedRooms();
      setUserRooms(rooms);
    } catch (error: any) {
      console.error('Error fetching rooms:', error);
      setError(error.response?.data?.error || 'Не удалось загрузить комнаты');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [user]);

  const refreshRooms = async () => {
    await fetchRooms();
  };

  const clearRooms = () => {
    setUserRooms([]);
  };

  return (
    <RoomContext.Provider
      value={{
        userRooms,
        loading,
        error,
        refreshRooms,
        clearRooms,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}; 