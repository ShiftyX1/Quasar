import api from './axios';

export interface Room {
  id: string;
  name: string;
  accessCode: string;
  ownerId: string;
  createdAt: string;
}

export interface CreateRoomParams {
  name: string;
}

export interface JoinRoomParams {
  accessCode: string;
}

export const createRoom = async (data: CreateRoomParams): Promise<Room> => {
  const response = await api.post<Room>('/rooms', data);
  return response.data;
};

export const getOwnedRooms = async (): Promise<Room[]> => {
  const response = await api.get<Room[]>('/rooms/owned');
  return response.data;
};

export const getRoomById = async (roomId: string): Promise<Room> => {
  const response = await api.get<Room>(`/rooms/${roomId}`);
  return response.data;
};

export const joinRoom = async (data: JoinRoomParams): Promise<{ roomId: string }> => {
  const response = await api.post<{ roomId: string }>('/memberships/join', data);
  return response.data;
};

export const getJoinedRooms = async (): Promise<Room[]> => {
  const response = await api.get<Room[]>('/memberships/joined');
  return response.data;
};

export const leaveRoom = async (roomId: string): Promise<void> => {
  await api.delete(`/memberships/${roomId}`);
}; 